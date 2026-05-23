import type { Application, Request, Response } from "express";
import express from "express";
import { globalErrorHandler } from "./middleware/error.middleware";
import { AuthRouter } from "./modules/auth/auth.routes";
import { Issuesrouter } from "./modules/issues/issue.route";

const app: Application = express();
app.use(express.json());
app.use(express.text());

app.get("/", (_, res) => {
  res.status(200).json({
    response: "Dev Plus Server is Running",
    status: 200,
  });
});
app.use("/api/auth", AuthRouter);
app.use("/api/issues", Issuesrouter);

app.use((_: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    errors: null,
    status: 404,
  });
});
app.use(globalErrorHandler);
export default app;
