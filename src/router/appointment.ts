import express from "express";
import {
  cancelAppointment,
  registerAppointment,
} from "../controllers/appointment";
import {
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
    registerAppointment
  );
  router.post(
    "/appointment/cancel",
    isAuthenticated,
    isOwner,
    isAppointmentValidForCancellation,
    cancelAppointment
  );
};
