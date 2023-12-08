import express from "express";
import appointment from "./appointment";
import authentication from "./authentication";
import medicines from "./medicines";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  appointment(router);
  medicines(router);
  return router;
};
