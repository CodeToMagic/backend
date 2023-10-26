import { db } from "../../helpers/db.server";
import {
  AppointmentHistory,
  AppointmentSlot,
  createAppointmentRequest,
} from "../../helpers/types";

export const getSlotInformation = async (
  doctorId: number,
  date: Date,
  slot: "MORNING" | "AFTERNOON"
): Promise<AppointmentSlot | null> => {
  return db.appointmentSlots.findFirst({
    where: {
      AND: [
        {
          doctorId,
          date,
          slot,
        },
      ],
    },
  });
};

export const getSlotInformationBySlotId = async (
  slotId: number
): Promise<AppointmentSlot | null> => {
  return db.appointmentSlots.findUnique({ where: { slotId } });
};

export const updateSlotInformation = async (
  updateData: AppointmentSlot
): Promise<AppointmentSlot | null> => {
  return db.appointmentSlots.update({
    where: { slotId: updateData.slotId },
    data: updateData,
  });
};

export const createNewSlot = async (
  req: createAppointmentRequest
): Promise<AppointmentSlot> => {
  return db.appointmentSlots.create({ data: req });
};

export const createNewAppointment = async (
  req: Omit<AppointmentHistory, "appointmentId">
): Promise<AppointmentHistory | null> => {
  return db.appointmentHistory.create({ data: req });
};

export const getCurrentAppointmentInformation = async (
  appointmentId: number
): Promise<AppointmentHistory | null> => {
  return db.appointmentHistory.findUnique({ where: { appointmentId } });
};

export const updateCurrentAppointment = async (
  appointmentId: number,
  data: AppointmentHistory
): Promise<AppointmentHistory> => {
  return db.appointmentHistory.update({ where: { appointmentId }, data });
};

export const getCurrentAppointmentInformationInfo = async (
  slotId: number,
  patientId: number
) => {
  return db.appointmentHistory.findFirst({
    where: { AND: [{ slotId, patientId }] },
  });
};

export const getAlltAppointmentsByPatientId = async (patientId: number) => {
  return db.appointmentHistory.findMany({
    where: { patientId },
    include: {
      appointmentSlots: {
        select: {
          slotId: true,
          date: true,
          slot: true,
          doctorId: true,
          user: {
            select: {
              uhid: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              gender: true,
              address: true,
            },
          },
        },
      },
    },
    orderBy: {
      appointmentSlots: { date: "desc" },
    },
  });
};
