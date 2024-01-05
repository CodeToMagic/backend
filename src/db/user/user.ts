import { cloneDeep } from "lodash";
import { db } from "../../helpers/db.server";
import { DoctorsAvailability, User, result } from "../../helpers/types";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return db.user.findUnique({ where: { email } });
};

export const createUser = async (
  user: Omit<User, "uhid" | "active" | "deactivationDate">
): Promise<User> => {
  return db.user.create({
    data: user,
    select: {
      uhid: true,
      email: true,
      firstName: true,
      lastName: true,
      active: true,
      gender: true,
      phoneNumber: true,
      address: true,
      dob: true,
      creditCard: true,
      userRole: true,
      saltedPassword: true,
      sessionToken: true,
      salt: true,
      weight: true,
      height: true,
    },
  });
};

export const updateUser = async (
  user: Omit<User, "active" | "deactivationDate">
): Promise<User> => {
  return db.user.update({
    where: { uhid: user.uhid },
    data: user,
  });
};

export const getUserBySessionToken = async (
  sessionToken: string
): Promise<User | null> => {
  return db.user.findFirst({ where: { sessionToken } });
};

export const getUserByUhid = async (uhid: number): Promise<User | null> => {
  return db.user.findUnique({ where: { uhid } });
};

export const getAllDoctorsDB = async () => {
  return db.user.findMany({
    where: {
      userRole: "DOCTOR",
    },
    select: {
      uhid: true,
      email: true,
      firstName: true,
      lastName: true,
      active: true,
      gender: true,
      phoneNumber: true,
      address: true,
    },
  });
};

const fetchDoctorAvailability = async (startDate: Date, endDate: Date) => {
  var currentDate = cloneDeep(startDate);
  const doctorsAvailability: DoctorsAvailability = {};
  const finalRes: result = {};
  const doctors = await db.user.findMany({
    where: {
      userRole: "DOCTOR",
    },
  });
  doctors.forEach((doctor) => {
    doctorsAvailability[doctor.uhid] = {
      MORNING: { slotsAvailable: 30 },
      AFTERNOON: { slotsAvailable: 30 },
      uhid: doctor.uhid,
      email: doctor.email,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      gender: doctor.gender,
      phoneNumber: doctor.phoneNumber,
      address: doctor.address,
    };
  });

  while (currentDate <= endDate) {
    finalRes[currentDate.toLocaleDateString()] = cloneDeep(doctorsAvailability);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  var currentDate = cloneDeep(startDate);
  while (currentDate <= endDate) {
    // Fetch morning and afternoon slots concurrently for each day
    const [morningSlots, afternoonSlots] = await Promise.all([
      db.appointmentSlots.findMany({
        where: {
          date: currentDate,
          slot: "MORNING",
        },
        include: {
          user: true,
        },
      }),
      db.appointmentSlots.findMany({
        where: {
          date: currentDate,
          slot: "AFTERNOON",
        },
        include: {
          user: true,
        },
      }),
    ]);
    morningSlots.forEach((slot) => {
      finalRes[currentDate.toLocaleDateString()][slot.doctorId][
        "MORNING"
      ].slotsAvailable = slot.availableCount;
    });

    afternoonSlots.forEach((slot) => {
      finalRes[currentDate.toLocaleDateString()][slot.doctorId][
        "AFTERNOON"
      ].slotsAvailable = slot.availableCount;
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return finalRes;
};

export const getDoctorsAvailabilityAsync = async (from: Date, to: Date) => {
  const result = await fetchDoctorAvailability(from, to);
  return result;
};

export const appointmentHistoryByUserId = async (uhid: number) => {
  return db.appointmentHistory.findMany({ where: { patientId: uhid } });
};
