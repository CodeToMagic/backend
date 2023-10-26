import express from "express";
import { AppointmentHistory } from "helpers/types";
import { get, merge } from "lodash";
import {
  CANT_REGISTER,
  CAN_CANCEL_ONLY_SCHEDULED_APPOINTMENT,
  DOCTOR,
  INSUFFICIENT_PERMISSION,
  INVALID_DOCTOR,
  INVALID_REQUEST,
  INVALID_SESSION,
  NO_APPOINTMENTS_FOUND,
  NO_APPOINTMENT_ID,
  SCHEDULED,
  SESSION_TOKEN_COOKIE,
  SYSTEM_ERROR,
} from "../helpers/constants";
import { validateRegisterAppointment } from "../helpers/validations";
import {
  getCurrentAppointmentInformation,
  getCurrentAppointmentInformationInfo,
  getSlotInformation,
} from "../services/appointmentHistory/appointmentHistory.service";
import {
  getUserBySessionToken,
  getUserByUhid,
} from "../services/user/user.service";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies[SESSION_TOKEN_COOKIE];
    if (!sessionToken) {
      return res.status(403).json({
        errorMessage: INVALID_SESSION,
      });
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(403).json({
        errorMessage: INVALID_SESSION,
      });
    }
    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    return res.sendStatus(400);
  }
};

export const isValidDoctor = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) {
      return res.sendStatus(403);
    }
    const doctorData = await getUserByUhid(parseInt(doctorId));
    if (!doctorData || doctorData.userRole != DOCTOR) {
      return res.status(403).json({
        errorMessage: INVALID_DOCTOR,
      });
    }
    merge(req, { doctor: doctorData });
    return next();
  } catch (error) {
    return res.status(400).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};
export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { appointmentId } = req.body;
    const currentUserId = get(req, "identity.uhid") as number;
    if (!currentUserId) {
      return res.status(403).json({
        errorMessage: INVALID_SESSION,
      });
    }
    if (!appointmentId) {
      return res.status(403).json({
        errorMessage: NO_APPOINTMENT_ID,
      });
    }
    const appointmentDetails = await getCurrentAppointmentInformation(
      parseInt(appointmentId)
    );
    if (!appointmentDetails) {
      return res.status(403).json({
        errorMessage: NO_APPOINTMENTS_FOUND,
      });
    }
    if (currentUserId != appointmentDetails.patientId) {
      return res.status(403).json({
        errorMessage: INSUFFICIENT_PERMISSION,
      });
    }
    merge(req, { appointmentDetails: appointmentDetails });
    next();
  } catch (error) {
    return res.status(400).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};
export const checkIfSlotIsClaimed = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const valid = validateRegisterAppointment(req.body);
    if (valid.error) {
      return res.status(400).json({ errorMessage: INVALID_REQUEST });
    }

    let slotDetails = await getSlotInformation(
      valid.value.doctorId,
      valid.value.date,
      valid.value.slot
    );
    if (slotDetails) {
      const currentUserId = get(req, "identity.uhid") as number;
      const appointmentInformation = await getCurrentAppointmentInformationInfo(
        slotDetails.slotId,
        currentUserId
      );

      if (appointmentInformation)
        return res.status(400).json({
          errorMessage: CANT_REGISTER,
        });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};
export const isAppointmentValidForCancellation = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const appointmentDetails = get(
      req,
      "appointmentDetails"
    ) as AppointmentHistory;
    if (appointmentDetails.currentStatus != SCHEDULED) {
      return res.status(400).json({
        errorMessage: CAN_CANCEL_ONLY_SCHEDULED_APPOINTMENT,
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};
