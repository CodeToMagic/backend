import { Medicines } from "@prisma/client";
import { db } from "../../helpers/db.server";


export const createMedicineDB = async (data: Omit<Medicines, 'medicineId'>): Promise<Medicines> => {
    return db.medicines.create({ data });
}

export const getAllMedicinesDB = async (): Promise<Medicines[]> => {
    return db.medicines.findMany();
}

export const getMedicineByIdBD = async (medicineId: number): Promise<Medicines | null> => {
    return db.medicines.findUnique({ where: { medicineId } });
}

export const updateMedicineDB = async (medicineId: number, data: Partial<Medicines>): Promise<Medicines | null> => {
    return db.medicines.update({ where: { medicineId }, data });
}

export const deleteMedicineDB = async (medicineId: number): Promise<Medicines | null> => {
    return db.medicines.delete({ where: { medicineId } });
}