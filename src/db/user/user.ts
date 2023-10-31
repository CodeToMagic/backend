import { db } from "../../helpers/db.server";
import { User } from "../../helpers/types";

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
