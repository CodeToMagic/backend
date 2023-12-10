import express from "express";
import { isAuthenticated, isDoctor } from "../middlewares";
import {
  createPrescriptionAndOrderByDoctor,
  getCurrentUserOrderHistory,
} from "../services/orders";
export default (router: express.Router) => {
  router.post(
    "/order",
    isAuthenticated,
    isDoctor,
    createPrescriptionAndOrderByDoctor
  );
  router.get("/orders", isAuthenticated, isDoctor, getCurrentUserOrderHistory);
};
