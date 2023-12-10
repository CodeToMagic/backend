import {
  handleInternalServerError,
  handleInvalidRequestError,
} from "../helpers/errors";
import express from "express";
import { get } from "lodash";
import {
  createPrescriptionAndOrder,
  getOrderHistoryByUserId,
} from "../db/orders/orders";
export const createPrescriptionAndOrderByDoctor = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { appointmentId, shouldOrder, items, totalAmount } = req?.body;
    const userId = get(req, "identity.uhid") as number;
    if (!appointmentId || !shouldOrder || !items || !totalAmount) {
      return handleInvalidRequestError(res);
    }
    await createPrescriptionAndOrder(
      appointmentId,
      shouldOrder,
      items,
      userId,
      totalAmount
    );
    return res.status(200).json({
      successMessage: "SUCCESS",
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};

export const getCurrentUserOrderHistory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = get(req, "identity.uhid") as number;
    const orderHistory = await getOrderHistoryByUserId(userId);
    return res.status(200).json({
      orderHistory,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};
