import express from "express";
import * as resumeController from "./resume.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/uploadMiddleware.js";

const router =express.Router();

resumeController.post("/" , authenticate , upload.single("resume" , resumeController.upload));
router.get("/me", authenticate, resumeController.getMine);
router.patch("/", authenticate, upload.single("resume"), resumeController.update);
router.delete("/", authenticate, resumeController.remove);

export default router;
