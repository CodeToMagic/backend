import express from "express";
import {
  cancelAppointment,
  patientAppointmentHistory,
  registerAppointment,
} from "../controllers/appointment";
import {
  checkIfSlotIsClaimed,
  isAppointmentValidForCancellation,
  isAuthenticated,
  isOwner,
  isValidDoctor,
} from "../middlewares";

export default (router: express.Router) => {
  router.post(
    "/appointment/schedule",
    isAuthenticated,
    isValidDoctor,
    checkIfSlotIsClaimed,
    registerAppointment
  );
  router.post(
    "/appointment/cancel",
    isAuthenticated,
    isOwner,
    isAppointmentValidForCancellation,
    cancelAppointment
  );
  router.get(
    "/appointment/history",
    isAuthenticated,
    patientAppointmentHistory
  );
};
