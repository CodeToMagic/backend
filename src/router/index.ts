import express from "express";
import appointment from "./appointment";
import authentication from "./authentication";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  appointment(router);
  return router;
};
