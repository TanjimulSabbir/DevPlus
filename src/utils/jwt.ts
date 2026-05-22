import jwt from "jsonwebtoken";
import { config } from "../config";
import type { TJwtPayload } from "../types/jwt";

export const generateToken = (payload: object) => {
  return jwt.sign(payload, config.jwtSecret as string, {
    expiresIn: "7d",
  });
};
export const verifyToken = (token: string): TJwtPayload => {
  return jwt.verify(token, config.jwtSecret as string) as TJwtPayload;
};
