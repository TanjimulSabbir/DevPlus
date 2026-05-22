import type { Application } from "express";
import express from "express";
import { AuthRouter } from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./middleware/error.middleware";

const app: Application = express();
app.use(express.json());
app.use(express.text());

app.get("/", (req, res) => {
  res.status(200).json({
    response: "server is running",
    status: 200,
  });
});
app.use("/api/auth", AuthRouter);

app.use(globalErrorHandler);
export default app;
