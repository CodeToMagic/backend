import express from "express";
import { isAuthenticated, isDoctor } from "../middlewares";
import { createPrescriptionAndOrderByDoctor } from "../services/orders";
export default (router: express.Router) => {
  router.post(
    "/order",
    isAuthenticated,
    isDoctor,
    createPrescriptionAndOrderByDoctor
  );
};
