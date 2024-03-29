import express from "express";
import { AppointmentHistory } from "helpers/types";
import { get } from "lodash";
import {
  createNewAppointment,
  createNewSlot,
  getAlltAppointmentsByPatientId,
  getSlotInformation,
  getSlotInformationBySlotId,
  updateCurrentAppointment,
  updateSlotInformation,
} from "../db/appointmentHistory/appointmentHistory";
import {
  APPOINTMENT_DETAILS_FETCHED,
  CANCELED,
  INSUFFICIENT_PERMISSION,
  INVALID_REQUEST,
  NO_SLOTS_AVAILABLE,
  SCHEDULED,
  SLOT_BOOKING_CANCELED,
  SLOT_BOOKING_SUCCESS,
  SOMETHING_WENT_WRONG,
  SYSTEM_ERROR,
} from "../helpers/constants";
import { validateRegisterAppointment } from "../helpers/validations";
import {
  handleInternalServerError,
  handleInvalidRequestError,
} from "../helpers/errors";
import { appointmentHistoryByUserId } from "../db/user/user";

export const registerAppointment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const valid = validateRegisterAppointment(req.body);

    if (valid.error) {
      return res.status(400).json({ errorMessage: INVALID_REQUEST });
    }

    const currentUserId = get(req, "identity.uhid") as number;
    const doctorId = get(req, "doctor.uhid") as number;

    let slotDetails = await getSlotInformation(
      doctorId,
      valid.value.date,
      valid.value.slot
    );
    if (!slotDetails) {
      slotDetails = await createNewSlot({
        doctorId,
        date: valid.value.date,
        slot: valid.value.slot,
      });
    }
    if (slotDetails.availableCount > 0) {
      await createNewAppointment({
        slotId: slotDetails.slotId,
        patientId: currentUserId,
        currentStatus: SCHEDULED,
      });
      slotDetails.availableCount = slotDetails.availableCount - 1;
      await updateSlotInformation(slotDetails);

      return res.status(200).json({
        successMessage: SLOT_BOOKING_SUCCESS,
      });
    } else {
      return res.status(500).json({
        errorMessage: NO_SLOTS_AVAILABLE,
      });
    }
  } catch (error) {
    return res.status(500).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};

export const cancelAppointment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const currentUserId = get(req, "identity.uhid") as number;
    const userRole = get(req, "identity.userRole") as string;
    const appointmentDetails = get(
      req,
      "appointmentDetails"
    ) as AppointmentHistory;
    appointmentDetails.currentStatus = CANCELED;
    await updateCurrentAppointment(
      appointmentDetails.appointmentId,
      appointmentDetails
    );
    const slotInformation = await getSlotInformationBySlotId(
      appointmentDetails.slotId
    );
    if (!slotInformation) {
      return res.status(500).json({
        errorMessage: SOMETHING_WENT_WRONG,
      });
    }
    if (userRole === "DOCTOR" && slotInformation.doctorId !== currentUserId) {
      return res.status(400).json({
        errorMessage: INSUFFICIENT_PERMISSION,
      });
    }
    slotInformation.availableCount = slotInformation.availableCount + 1;
    await updateSlotInformation(slotInformation);
    return res.status(200).json({
      successMessage: SLOT_BOOKING_CANCELED,
    });
  } catch (error) {
    return res.status(500).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};

export const patientAppointmentHistory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const currentUserId = get(req, "identity.uhid") as number;
    const appointmentHistory = await getAlltAppointmentsByPatientId(
      currentUserId
    );
    return res.status(200).json({
      successMessage: APPOINTMENT_DETAILS_FETCHED,
      patientAppointmentHistory: appointmentHistory,
    });
  } catch (error) {
    return res.status(500).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};

export const getAlltAppointmentsByudhi = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const currentUserId = get(req, "identity.uhid") as number;
    if (!currentUserId) {
      return handleInvalidRequestError(res);
    }
    const appointmentDetails = await appointmentHistoryByUserId(currentUserId);
    return res.status(200).json({
      appointmentDetails: appointmentDetails,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};
