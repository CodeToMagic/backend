import express from "express";
import appointment from "./appointment";
import authentication from "./authentication";
import medicines from "./medicines";
import doctors from "./doctors";
import orders from "./orders";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  appointment(router);
  medicines(router);
  doctors(router);
  orders(router);
  return router;
};
