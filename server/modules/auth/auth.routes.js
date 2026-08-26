import express from "express";
import * as authController from "./auth.controller.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me",authentificate, authController.me);
router.post("/logout", authController.logout);

export default router;