import express from "express";
import {
  handleInternalServerError,
  handleInvalidRequestError,
} from "../helpers/errors";
import { getAllDoctorsDB } from "../db/user/user";
import { retrieveDoctorAppointmentsInDateRange } from "../db/appointmentHistory/appointmentHistory";
import { doctorAppointmentsSchema } from "../helpers/validations";
import { get } from "lodash";

export const getAllDoctors = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const doctors = await getAllDoctorsDB();
    return res.status(200).json({ doctors: doctors });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};

export const getAllDoctorAppointmentsInDateRange = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const valid = doctorAppointmentsSchema.validate(req?.body);
    const doctorId = get(req, "identity.uhid") as number;
    if (valid.error) {
      return handleInvalidRequestError(res);
    }
    const doctorSlots = await retrieveDoctorAppointmentsInDateRange(
      doctorId,
      valid.value.from,
      valid.value.to
    );
    return res.status(200).json({ doctorSlots: doctorSlots });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};
