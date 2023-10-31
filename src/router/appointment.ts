import express from "express";
import {
  checkIfSlotIsClaimed,
  isAppointmentValidForCancellation,
  isAuthenticated,
  isDoctor,
  isOwner,
  isValidDoctor,
} from "../middlewares";
import {
  cancelAppointment,
  patientAppointmentHistory,
  registerAppointment,
} from "../services/appointment";

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
  router.post("/doctors/appointments", isAuthenticated, isDoctor);
};
