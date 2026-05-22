import jwt from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, config.jwtSecret as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret as string);
};
