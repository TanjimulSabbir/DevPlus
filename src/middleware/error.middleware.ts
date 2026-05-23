import type { Request, Response, NextFunction } from "express";

type TError = {
  statusCode?: number;
  message?: string;
  errors?: any;
};

export const globalErrorHandler = (
  err: TError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || null,
  });
};
