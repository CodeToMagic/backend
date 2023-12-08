import express from "express";
import { createMedicine, deleteMedicine, getAllMedicines, updateMedicine } from "../services/medicines";
import { isAdmin, isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
    router.post("/medicines/create", isAuthenticated, isAdmin, createMedicine);
    router.put("/medicines/:medicineId", isAuthenticated, isAdmin, updateMedicine);
    router.delete("/medicines/:medicineId", isAuthenticated, isAdmin, deleteMedicine);
    router.get("/medicines",isAuthenticated,getAllMedicines);
    router.get("/medicines/:medicineId",isAuthenticated,getAllMedicines);
}