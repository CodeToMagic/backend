import express from "express";
import { isAuthenticated, isDoctor } from "../middlewares";
import {
  getAllDoctorAppointmentsInDateRange,
  getAllDoctors,
} from "../services/doctor";
export default (router: express.Router) => {
  router.get("/doctors", isAuthenticated, getAllDoctors);
  router.post(
    "/doctors/appointments",
    isAuthenticated,
    isDoctor,
    getAllDoctorAppointmentsInDateRange
  );
};
