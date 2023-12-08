import express from "express";
import { handleInternalServerError } from "../helpers/errors";
import { getAllDoctorsDB } from "../db/user/user";

export const getAllDoctors = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const doctors = await getAllDoctorsDB();
    return res.status(200).json({ doctors: doctors });
  } catch (error) {
    handleInternalServerError(res, error);
  }
};
