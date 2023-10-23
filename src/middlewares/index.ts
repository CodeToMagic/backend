import express from "express";
import { get, merge } from "lodash";
import {
  getUserBySessionToken,
  getUserByUhid,
} from "../services/user/user.service";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["BACKEND-AUTH"];
    if (!sessionToken) {
      return res.sendStatus(403);
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.sendStatus(403);
    }
    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    return res.sendStatus(400);
  }
};

export const isValidDoctor = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) {
      return res.sendStatus(403);
    }
    const doctorData = await getUserByUhid(parseInt(doctorId));
    if (!doctorData || doctorData.userRole != "DOCTOR") {
      return res.sendStatus(403);
    }
    merge(req, { doctor: doctorData });
    return next();
  } catch (error) {
    return res.sendStatus(400);
  }
};
export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
    if (!currentUserId) {
      return res.sendStatus(400);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
