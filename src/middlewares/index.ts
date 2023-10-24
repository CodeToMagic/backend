import express from "express";
import { get, merge } from "lodash";
import {
  DOCTOR,
  INSUFFICIENT_PERMISSION,
  INVALID_DOCTOR,
  INVALID_SESSION,
  SESSION_TOKEN_COOKIE,
} from "../helpers/constants";
import { getCurrentSlotInformation } from "../services/appointmentHistory/appointmentHistory.service";
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
    const sessionToken = req.cookies[SESSION_TOKEN_COOKIE];
    if (!sessionToken) {
      return res.status(403).json({
        errorMessage: INVALID_SESSION,
      });
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(403).json({
        errorMessage: INVALID_SESSION,
      });
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
    if (!doctorData || doctorData.userRole != DOCTOR) {
      return res.status(403).json({
        errorMessage: INVALID_DOCTOR,
      });
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
    const { appointmentId } = req.params;
    const currentUserId = get(req, "identity.uhid") as number;
    if (!currentUserId) {
      return res.status(403).json({
        errorMessage: INVALID_SESSION,
      });
    }
    const appointmentDetails = await getCurrentSlotInformation(
      parseInt(appointmentId)
    );
    if (currentUserId == appointmentDetails.patientId) {
      return res.status(403).json({
        errorMessage: INSUFFICIENT_PERMISSION,
      });
    }

    next();
  } catch (error) {
    return res.status(403).json({
      errorMessage: error,
    });
  }
};
