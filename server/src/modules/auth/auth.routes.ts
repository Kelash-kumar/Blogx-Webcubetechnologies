import { Router } from "express";
import { register, login, refresh, logout, getMe } from "./auth.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.use(authenticate);
router.get("/me", getMe);
router.post("/logout", logout);

export default router;