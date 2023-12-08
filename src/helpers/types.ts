export type Role = "PATIENT" | "DOCTOR" | "ADMIN";

export type User = {
  uhid: number;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  deactivationDate?: Date | null;
  gender: string;
  phoneNumber: string;
  address: string;
  dob: Date;
  creditCard: string;
  userRole: Role;
  saltedPassword: string;
  sessionToken: string;
  salt: string;
};

export type AppointmentSlot = {
  slotId: number;
  doctorId: number;
  date: Date;
  slot: "MORNING" | "AFTERNOON";
  availableCount: number;
  updatedAt: Date;
};
export type AppointmentHistory = {
  appointmentId: number;
  slotId: number;
  patientId: number;
  currentStatus: "SCHEDULED" | "CANCELED" | "COMPLETED";
};
export type createUserRequest = {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  address: string;
  dob: Date;
  creditCard: string;
  userRole: Role;
  password: string;
  weight?: string;
  height?: string;
};

export type createAppointmentRequest = {
  doctorId: number;
  date: Date;
  slot: "MORNING" | "AFTERNOON";
};
