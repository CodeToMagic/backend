import express from "express";
import { registerAppointment } from "../controllers/appointment";
import { isAuthenticated, isValidDoctor } from "../middlewares";

export default (router: express.Router) => {
  router.post(
    "/appointment/schedule",
    isAuthenticated,
    isValidDoctor,
    registerAppointment
  );
};
