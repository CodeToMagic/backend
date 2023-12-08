import express from "express";
import { SYSTEM_ERROR } from "./constants";
export const handleInternalServerError = async (
  res: express.Response,
  error: Error
) => {
  return res.status(500).json({
    errorMessage: SYSTEM_ERROR,
    systemError: error,
  });
};
