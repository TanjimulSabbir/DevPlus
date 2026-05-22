import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asynce.handler";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

export const signupController = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.signup(req.body);
  sendResponse(res, 201, true, "User registered successfully", user);
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.login(req.body);
  sendResponse(res, 200, true, "User Login Successfully", user);
});
