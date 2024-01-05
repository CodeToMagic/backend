import express from "express";
import {
  login,
  logout,
  register,
  updateUserProfile,
} from "../services/authentication";
import { isAuthenticated } from "../middlewares";
import { get } from "lodash";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/logout", isAuthenticated, logout);
  router.get(
    "/auth/isAuthenticated",
    isAuthenticated,
    (req: express.Request, res: express.Response) => {
      const userInfo = get(req, "identity");
      return res.status(200).json({
        userInfo,
      });
    }
  );
  router.put("/auth/update", isAuthenticated, updateUserProfile);
};
