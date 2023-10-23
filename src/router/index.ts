import express from "express";
import appointment from "./appointment";
import authentication from "./authentication";
import users from "./users";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  appointment(router);
  return router;
};
