import { item } from "../../helpers/types";
import { db } from "../../helpers/db.server";
import { getSlotInformationBySlotId } from "../appointmentHistory/appointmentHistory";

export const createPrescriptionAndOrder = async (
  appointmentId: number,
  shouldOrder: boolean,
  items: item[],
  userId: number,
  totalAmount: number
) => {
  await db.prescriptionHistory.create({
    data: {
      appointmentId,
      currentStatus: "ISSUED",
      PrescriptionItems: {
        create: items.map((item) => ({
          medicines: { connect: { medicineId: item.medicineId } },
          qty: item.qty,
          description: null,
        })),
      },
    },
  });

  if (shouldOrder) {
    await db.orderHistory.create({
      data: {
        userId,
        totalAmount,
        currentStatus: "CONFIRMED",
        OrderHistoryItems: {
          create: items.map((item) => ({
            medicines: { connect: { medicineId: item.medicineId } },
            qty: item.qty,
          })),
        },
      },
    });
  }
  const appointmentDetails = await db.appointmentHistory.findUnique({
    where: { appointmentId: appointmentId },
  });
  appointmentDetails.currentStatus = "COMPLETED";
  await db.appointmentHistory.update({
    where: { appointmentId },
    data: appointmentDetails,
  });
};
