import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app.error";

export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      throw new AppError(
        403,
        "You do not have permission to access this resource",
      );
    }
    next();
  };
};
