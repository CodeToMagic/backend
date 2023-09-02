import crypto from "crypto";

// Don't change this, Any change happen here old users can't be authenticated anymore.
const SECRET = "56EF7F3888F7BBE4512375795D11D";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authenticate = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};
