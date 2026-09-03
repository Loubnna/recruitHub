import express from "express";
import * as authController from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { authLimiter } from "../../middleware/rateLimiter.js";

const router = express.Router();
router.post(
    "/register",
    validate(registerSchema),
    authController.register
);

router.post(
    "/login",
    authLimiter,
    validate(loginSchema),
    authController.login
);

router.get(
    "/me",
    authenticate,
    authController.me
);

router.post(
    "/logout",
    authController.logout
);
export default router;