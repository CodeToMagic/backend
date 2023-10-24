// Application constants
export const PORT: number = 3000;
export const SESSION_TOKEN_COOKIE: string = "BACKEND-AUTH";
export const DOMAIN: string = "localhost";

//STATUS
export const SCHEDULED: "SCHEDULED" = "SCHEDULED";

// ROLE constansts
export const DOCTOR: string = "DOCTOR";

//Success Messages
export const SLOT_BOOKING_SUCCESS: string = "Slot booking successful";

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
  "Sorry, all appointment slots are currently booked. Please choose another time or check back later.";
export const SYSTEM_ERROR: string = "System error occured";
