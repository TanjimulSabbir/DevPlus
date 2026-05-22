import type { Application } from "express";
import express from "express";
import { AuthRouter } from "./modules/auth/auth.routes";

const app: Application = express();
app.use(express.json());
app.use(express.text());

app.use("/api/auth", AuthRouter);

export default app;
