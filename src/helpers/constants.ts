// Application constants
export const PORT: number = 8080;
export const SESSION_TOKEN_COOKIE: string = "BACKEND-AUTH";
export const DOMAIN: string = "localhost";

//STATUS
export const SCHEDULED: "SCHEDULED" = "SCHEDULED";
export const CANCELED: "CANCELED" = "CANCELED";

// ROLE constansts
export const DOCTOR: string = "DOCTOR";

//Success Messages
export const SLOT_BOOKING_SUCCESS: string = "Slot booking successful";
export const SLOT_BOOKING_CANCELED: string =
  "You have successfully cancelled the appointment";
export const APPOINTMENT_DETAILS_FETCHED: string =
  "Appointment history fetched successfully";
export const LOG_OUT_SUCCESS = "Successfully loggedout";
export const UPDATE_SUCCESS = "User profile update successful";

export const MEDICINE_SUCCESS = "Medicine creation success";
export const MEDICINE_UPDATE_SUCCESS = "Medicine update success";
export const MEDICINE_DELETE_SUCCESS = "Medicine delete success";

// Error Messages
export const INVALID_SESSION: string =
  "Session token not found, Please login to complete this transaction";
export const INVALID_DOCTOR: string = "Invalid doctor uhid";
export const INSUFFICIENT_PERMISSION: string =
  "Insufficient permissions to process request";
export const INVALID_LOGIN_DETAILS: string =
  "Login details provided are invalid";
export const USER_NOT_FOUND: string = "User does not exist";
export const WRONG_PASSWORD: string = "Wrong password";
export const INVALID_USER_DETAILS: string = "User details provided are invalid";
export const DUPLICATE_USER: string = "User already exist";
export const INVALID_REQUEST: string = "Invalid request";
export const NO_SLOTS_AVAILABLE: string =
  "Sorry, all appointment slots are currently booked. Please choose another time or check back later";
export const SYSTEM_ERROR: string = "System error occured";
export const NO_APPOINTMENT_ID: string = "Appointment ID can't be null";
export const NO_APPOINTMENTS_FOUND: string =
  "No appointments found for the given appointment id";
export const SOMETHING_WENT_WRONG: string =
  "Something went wrong, Please contact admin";
export const CAN_CANCEL_ONLY_SCHEDULED_APPOINTMENT: string =
  "Haven't found any scheduled appointment";
export const CANT_REGISTER: string =
  "Can't make a duplicate appointment, either you have a scheduled or cancelled appointment in the same time frame";
export const ONLY_ADMIN =
  "Can't continue with this transaction, Admin privilege is required";
