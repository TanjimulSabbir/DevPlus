import { Router } from "express";
import { loginController, signupController } from "./auth.controller";
import { validate } from "../../middleware/data.validation";
import { createAccountSchema, LoginSchema } from "./auth.body.schema";

const router = Router();
router.post("/signup", validate(createAccountSchema), signupController);
router.post("/login", validate(LoginSchema), loginController);

export const AuthRouter = router;
