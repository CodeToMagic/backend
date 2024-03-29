import express from "express";
import {
  INVALID_REQUEST,
  MEDICINE_DELETE_SUCCESS,
  MEDICINE_SUCCESS,
  MEDICINE_UPDATE_SUCCESS,
  SYSTEM_ERROR,
} from "../helpers/constants";
import {
  createMedicineSchema,
  updateMedicineSchema,
} from "../helpers/validations";
import {
  createMedicineDB,
  deleteMedicineDB,
  getAllMedicinesDB,
  getMedicineByIdBD,
  updateMedicineDB,
} from "../db/medicines/medicines";

export const createMedicine = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const valid = createMedicineSchema.validate(req.body);

    if (valid.error) {
      return res.status(400).json({ errorMessage: INVALID_REQUEST });
    }

    const data = await createMedicineDB(req?.body);
    return res.status(200).json({
      successMessage: MEDICINE_SUCCESS,
      medicineId: data?.medicineId,
    });
  } catch (error) {
    return res.status(500).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};

export const updateMedicine = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const valid = updateMedicineSchema.validate(req.body);
    const medicineId = parseInt(req?.params?.medicineId, 10);
    if (!medicineId || valid.error) {
      return res.status(400).json({ errorMessage: INVALID_REQUEST });
    }
    await updateMedicineDB(medicineId, req?.body);
    return res.status(200).json({
      successMessage: MEDICINE_UPDATE_SUCCESS,
    });
  } catch (error) {
    return res.status(500).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};

export const deleteMedicine = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const medicineId = parseInt(req?.params?.medicineId, 10);
    if (!medicineId) {
      return res.status(400).json({ errorMessage: INVALID_REQUEST });
    }
    await deleteMedicineDB(medicineId);
    return res.status(204).json({
      successMessage: MEDICINE_DELETE_SUCCESS,
    });
  } catch (error) {
    return res.status(500).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};

export const getAllMedicines = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const medicines = await getAllMedicinesDB();
    return res.status(200).json({
      medicines: medicines,
    });
  } catch (error) {
    return error.status(500).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};

export const getMedicineById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const medicineId = parseInt(req?.params?.medicineId, 10);
    const medicine = await getMedicineByIdBD(medicineId);
    return res.status(200).json({
      medicine: medicine,
    });
  } catch (error) {
    return error.status(500).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};
