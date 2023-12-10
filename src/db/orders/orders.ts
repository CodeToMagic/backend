import { item } from "../../helpers/types";
import { db } from "../../helpers/db.server";

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
};
