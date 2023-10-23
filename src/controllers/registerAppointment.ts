import express from "express";
import { get } from "lodash";
import { validateRegisterAppointment } from "../helpers/validations";
import {
  createNewAppointment,
  createNewSlot,
  getSlotInformation,
  updateSlotInformation,
} from "../services/appointmentHistory/appointmentHistory.service";

export const registerAppointment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const valid = validateRegisterAppointment(req.body);

    if (valid.error) {
      return res.status(400).json({ errorMessage: "Invalid request" });
    }

    const currentUserId = get(req, "identity.uhid") as number;
    const doctorId = get(req, "doctor.uhid") as number;

    let slotDetails = await getSlotInformation(
      doctorId,
      valid.value.date,
      valid.value.slot
    );
    if (!slotDetails) {
      slotDetails = await createNewSlot({
        doctorId,
        date: valid.value.date,
        slot: valid.value.slot,
      });
    }
    if (slotDetails.availableCount > 0) {
      await createNewAppointment({
        slotId: slotDetails.slotId,
        patientId: currentUserId,
        currentStatus: "SCHEDULED",
      });
      slotDetails.availableCount = slotDetails.availableCount - 1;
      await updateSlotInformation(slotDetails);

      return res.status(200).json({
        successMessage: "Slot booking successful",
      });
    } else {
      return res.status(400).json({
        errorMessage:
          "Sorry, all appointment slots are currently booked. Please choose another time or check back later.",
      });
    }
  } catch (error) {
    return res.sendStatus(500);
  }
};
