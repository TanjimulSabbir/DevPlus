import { z } from "zod";
import { IssueStatus, IssueType } from "./constant";

export const createIssueSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    type: z.enum(IssueType),
    status: z.enum(IssueStatus).optional(),
  })
  .strict();

export const updateIssueSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(IssueType).optional(),
    status: z.enum(IssueStatus).optional(),
    reporter_id: z.coerce.number().int().positive().optional(),
  })
  .strict();
