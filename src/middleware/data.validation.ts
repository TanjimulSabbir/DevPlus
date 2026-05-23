import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/app.error";

export const validate =
  (schema: z.ZodTypeAny, target: "body" | "query" = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const data = target === "body" ? req.body : req.query;

    const result = schema.safeParse(data);

    if (!result.success) {
      throw new AppError(
        400,
        "Validation Error",
        result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        })),
      );
    }
    next();
  };
