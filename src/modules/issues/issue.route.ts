import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/data.validation";
import { roleMiddleware } from "../../middleware/role.middleware";
import {
  createIssueSchema,
  getIssuesQuerySchema,
  updateIssueSchema,
} from "./issue.body.schema";
import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
} from "./issue.controller";

const router = Router();

router.post("/", authMiddleware, validate(createIssueSchema), createIssue);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("maintainer", "contributor"),
  validate(getIssuesQuerySchema, "query"),
  getAllIssues,
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("maintainer", "contributor"),
  getSingleIssue,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("maintainer", "contributor"),
  validate(updateIssueSchema),
  updateIssue,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("maintainer"),
  deleteIssue,
);

export const Issuesrouter = router;
