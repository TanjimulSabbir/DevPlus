import type { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { config } from "../config";
import type { TJwtPayload } from "../types/jwt";
import { AppError } from "../utils/app.error";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(401, "Unauthorized access", [
      {
        field: "token",
        code: "UNAUTHORIZED_ACCESS",
        message: "token is required",
      },
    ]);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret as string);
    req.user = decoded as TJwtPayload;
    next();
  } catch (error) {
    next(new AppError(401, "Invalid or expired token"));
  }
};
