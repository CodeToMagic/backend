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
