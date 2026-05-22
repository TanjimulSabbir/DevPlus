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
    const { sort, type, status } = req.query;

    const result = await IssueService.getAllIssues(
      sort as string,
      type as string,
      status as string,
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
