import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/app.error";

export const validate =
  (schema: z.ZodObject<any>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      const errors =
        err?.issues?.map((issue: any) => ({
          field: issue.path.join("."),
          message: issue.message,
        })) || [];

      throw new AppError(400, "Validation Error", errors);
    }
  };