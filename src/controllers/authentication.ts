import express from "express";
import { authenticate, random } from "../helpers";
import {
  validateCreateUserData,
  validateLoginData,
} from "../helpers/validations";
import {
  createUser,
  getUserByEmail,
  updateUser,
} from "../services/user/user.service";
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const valid = validateLoginData(req.body);

    if (valid.error) {
      return res
        .status(400)
        .json({ errorMessage: "Login details provided are invalid" });
    }

    const user = await getUserByEmail(valid.value.email);

    if (!user) {
      return res.status(400).json({ errorMessage: "User does not exist" });
    }

    const expectedHash = authenticate(user.salt, valid.value.password);

    if (user.saltedPassword != expectedHash) {
      return res.status(403).json({ errorMessage: "Wrong password" });
    }

    const salt = random();
    user.sessionToken = authenticate(salt, user.email);

    const updatedUser = await updateUser(user);

    res.cookie("BACKEND-AUTH", user.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(updatedUser).end();
  } catch (error) {
    return res.status(400);
  }
};
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const valid = validateCreateUserData(req.body);
    if (valid.error) {
      return res
        .status(400)
        .json({ errorMessage: "User details provided are invalid" });
    }
    const existingUser = await getUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ errorMessage: "User already exist" });
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
    console.log(error);
    return res.sendStatus(500);
  }
};
