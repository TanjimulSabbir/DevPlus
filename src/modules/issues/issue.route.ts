import { Router } from "express";

import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
} from "./issue.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";
import { validate } from "../../middleware/data.validation";
import { createIssueSchema, updateIssueSchema } from "./issue.body.schema";

const router = Router();

router.post("/", authMiddleware, validate(createIssueSchema), createIssue);

router.get("/", getAllIssues);

router.get("/:id", getSingleIssue);

router.patch("/:id", authMiddleware,  validate(updateIssueSchema), updateIssue);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("maintainer"),
  deleteIssue,
);

export const Issuesrouter = router;
