import express from "express";
import { createMedicine, deleteMedicine, updateMedicine } from "../services/medicines";
import { isAdmin, isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
    router.post("/medicines/create", isAuthenticated, isAdmin, createMedicine);
    router.put("/medicines/:medicineId", isAuthenticated, isAdmin, updateMedicine);
    router.delete("/medicines/:medicineId", isAuthenticated, isAdmin, deleteMedicine);
}