import express from "express";
import { createUser, getUserByEmail, updateUser } from "../db/user/user";
import { authenticate, random } from "../helpers";
import {
  DOMAIN,
  DUPLICATE_USER,
  INVALID_LOGIN_DETAILS,
  INVALID_USER_DETAILS,
  LOG_OUT_SUCCESS,
  SESSION_TOKEN_COOKIE,
  SYSTEM_ERROR,
  UPDATE_SUCCESS,
  USER_NOT_FOUND,
  WRONG_PASSWORD,
} from "../helpers/constants";
import {
  userUpdateValidationSchema,
  validateCreateUserData,
  validateLoginData,
} from "../helpers/validations";
import { get } from "lodash";
import { User } from "helpers/types";
import {
  handleInternalServerError,
  handleInvalidRequestError,
} from "../helpers/errors";
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const valid = validateLoginData(req.body);
    if (valid.error) {
      return res.status(400).json({ errorMessage: INVALID_LOGIN_DETAILS });
    }

    const user = await getUserByEmail(valid.value.email);

    if (!user) {
      return res.status(400).json({ errorMessage: USER_NOT_FOUND });
    }

    const expectedHash = authenticate(user.salt, valid.value.password);

    if (user.saltedPassword != expectedHash) {
      return res.status(403).json({ errorMessage: WRONG_PASSWORD });
    }

    const salt = random();
    user.sessionToken = authenticate(salt, user.email);

    const updatedUser = await updateUser(user);

    res.cookie(SESSION_TOKEN_COOKIE, user.sessionToken, {
      domain: DOMAIN,
      path: "/",
      httpOnly: true,
    });

    return res.status(200).json(updatedUser).end();
  } catch (error) {
    return res.status(500).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};
export const logout = async (req: express.Request, res: express.Response) => {
  try {
    const user = get(req, "identity") as User;
    user.sessionToken = "";
    await updateUser(user);
    return res.status(200).json({
      successMessage: LOG_OUT_SUCCESS,
    });
  } catch (error) {
    return res.status(500).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const valid = validateCreateUserData(req.body);
    if (valid.error) {
      return res.status(400).json({ errorMessage: INVALID_USER_DETAILS });
    }
    const existingUser = await getUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ errorMessage: DUPLICATE_USER });
    }
    const salt = random();
    const user = await createUser({
      email: valid.value.email,
      saltedPassword: authenticate(salt, valid.value.password),
      address: valid.value.address,
      creditCard: valid.value.creditCard,
      dob: valid.value.dob,
      firstName: valid.value.firstName,
      gender: valid.value.gender,
      lastName: valid.value.lastName,
      phoneNumber: valid.value.phoneNumber,
      userRole: valid.value.userRole,
      sessionToken: authenticate(salt, valid.value.email),
      salt: salt,
      height: valid.value.height,
      weight: valid.value.weight,
    });
    return res.status(200).json(user).end();
  } catch (error) {
    return res.status(500).json({
      errorMessage: SYSTEM_ERROR,
      systemError: error,
    });
  }
};

export const updateUserProfile = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const updatedData = get(req, "identity") as User;
    const valid = userUpdateValidationSchema.validate(req?.body);
    if (valid.error) {
      return handleInvalidRequestError(res);
    }
    const salt = random();
    if (valid.value.firstName !== undefined)
      updatedData.firstName = valid.value.firstName;
    if (valid.value.lastName !== undefined)
      updatedData.lastName = valid.value.lastName;
    if (valid.value.address !== undefined)
      updatedData.address = valid.value.address;
    if (valid.value.creditCard !== undefined)
      updatedData.creditCard = valid.value.creditCard;
    if (valid.value.dob !== undefined) updatedData.dob = valid.value.dob;
    if (valid.value.gender !== undefined)
      updatedData.gender = valid.value.gender;
    if (valid.value.phoneNumber !== undefined)
      updatedData.phoneNumber = valid.value.phoneNumber;
    if (valid.value.userRole !== undefined)
      updatedData.userRole = valid.value.userRole;
    if (valid.value.password !== undefined) {
      updatedData.saltedPassword = authenticate(salt, valid.value.password); // Update password
      updatedData.salt = salt;
    }
    if (valid.value.height !== undefined)
      updatedData.height = valid.value.height;
    if (valid.value.weight !== undefined)
      updatedData.weight = valid.value.weight;
    await updateUser(updatedData);
    return res.status(200).json({
      successMessage: UPDATE_SUCCESS,
    });
  } catch (error) {
    return handleInternalServerError(res, error);
  }
};
