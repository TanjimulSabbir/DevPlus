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

const router = Router();

router.post("/", authMiddleware, createIssue);

router.get("/", getAllIssues);

router.get("/:id", getSingleIssue);

router.patch("/:id", authMiddleware, updateIssue);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("maintainer"),
  deleteIssue,
);

export const Issuesrouter = router;
