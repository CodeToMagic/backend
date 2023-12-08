import Joi from "joi";
import { createAppointmentRequest, createUserRequest } from "./types";

export const validateLoginData = (login: {
  email: string;
  password: string;
}) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(36).required(),
  });
  return loginSchema.validate(login);
};

export const validateCreateUserData = (req: createUserRequest) => {
  const createUserSchema = Joi.object<createUserRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(36).required(),
    gender: Joi.string()
      .valid("Male", "Female", "Other")
      .default("Not specified"),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().required(),
    weight: Joi.string(),
    height: Joi.string(),
    dob: Joi.date().required(),
    creditCard: Joi.string().required(),
    userRole: Joi.string()
      .valid("PATIENT", "DOCTOR", "ADMIN")
      .default("PATIENT"),
  });
  return createUserSchema.validate(req);
};

export const validateRegisterAppointment = (req: createAppointmentRequest) => {
  const createAppointmentSchema = Joi.object<createAppointmentRequest>({
    slot: Joi.string().valid("MORNING", "AFTERNOON").required(),
    date: Joi.date().required(),
    doctorId: Joi.number().required(),
  });
  return createAppointmentSchema.validate(req);
};

export const validateDoctorAppointmentsInDateRange = async (req: {
  from: Date;
  to: Date;
}) => {
  const dateRangeSchema = Joi.object({
    from: Joi.date().required(),
    to: Joi.date()
      .required()
      .min(Joi.ref("from"))
      .message(`To must be grater than from`),
  });
  return dateRangeSchema.validate(req);
};

export const createMedicineSchema = Joi.object({
  medicineName: Joi.string().required(),
  availableQTY: Joi.number().integer().required(),
  cost: Joi.number().required(),
  isPrescriptionNeeded: Joi.boolean().required(),
  description: Joi.string().required(),
  imageUrl: Joi.string().required(),
});

export const updateMedicineSchema = Joi.object({
  medicineName: Joi.string(),
  availableQTY: Joi.number().integer(),
  cost: Joi.number(),
  isPrescriptionNeeded: Joi.boolean(),
  description: Joi.string(),
  imageUrl: Joi.string(),
});

export const doctorAppointmentsSchema = Joi.object({
  from: Joi.date().required(),
  to: Joi.date().required(),
});
