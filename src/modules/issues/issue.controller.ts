import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { IssueService } from "./issue.service";
import { asyncHandler } from "../../utils/asynce.handler";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { config } from "../../config";
import { error } from "node:console";
import { AppError } from "../../utils/app.error";
import type { TIssueStatus, TIssueType } from "./issue.interface";
import { IssueStatus, IssueType } from "./constant";
import { getIssuesQuerySchema } from "./issue.body.schema";

export const createIssue = asyncHandler(async (req: Request, res: Response) => {
  const result = await IssueService.createIssue(req.body, req.user.id);

  sendResponse(
    res,
    StatusCodes.CREATED,
    true,
    "Issue created successfully",
    result,
  );
});

export const getAllIssues = asyncHandler(
  async (req: Request, res: Response) => {
    const validationResult = getIssuesQuerySchema.safeParse(req.query);

    if (!validationResult.success) {
      throw new AppError(
        400,
        "Invalid query parameters",
        validationResult.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        })),
      );
    }

    const { sort, type, status } = validationResult.data;

    const result = await IssueService.getAllIssues(
      sort as "newest" | "oldest",
      type as TIssueType,
      status as TIssueStatus,
    );

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Issues fetched successfully",
      result,
    );
  },
);

export const getSingleIssue = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await IssueService.getSingleIssue(Number(req.params.id));

    sendResponse(
      res,
      StatusCodes.OK,
      true,
      "Issue fetched successfully",
      result,
    );
  },
);

export const updateIssue = asyncHandler(async (req: Request, res: Response) => {
  const result = await IssueService.updateIssue(
    Number(req.params.id),
    req.body,
    req.user,
  );

  sendResponse(res, StatusCodes.OK, true, "Issue updated successfully", result);
});

export const deleteIssue = asyncHandler(async (req: Request, res: Response) => {
  await IssueService.deleteIssue(Number(req.params.id));

  sendResponse(res, StatusCodes.OK, true, "Issue deleted successfully");
});
