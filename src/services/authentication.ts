import express from "express";
import { createUser, getUserByEmail, updateUser } from "../db/user/user";
import { authenticate, random } from "../helpers";
import {
  DOMAIN,
  DUPLICATE_USER,
  INVALID_LOGIN_DETAILS,
  INVALID_USER_DETAILS,
  SESSION_TOKEN_COOKIE,
  USER_NOT_FOUND,
  WRONG_PASSWORD,
} from "../helpers/constants";
import {
  validateCreateUserData,
  validateLoginData,
} from "../helpers/validations";
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

    // Set the cookie
    res.cookie(SESSION_TOKEN_COOKIE, user.sessionToken, {
      domain: DOMAIN,
      path: "/",
    });

    // Return the response with user role included
    return res
      .status(200)
      .json({
        ...updatedUser,
        userRole: user.userRole, // Ensure this matches the property name in your User model
      })
      .end();
  } catch (error) {
    return res.status(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const valid = validateCreateUserData(req.body);
    console.log(valid);
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
    });
    return res.status(200).json(user).end();
  } catch (error) {
    return res.sendStatus(500);
  }
};
