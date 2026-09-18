import express from "express";
import * as interviewController from "./interview.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
    createInterviewSchema,
    updateInterviewSchema,
    feedbackSchema
} from "./interview.validation.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    validate(createInterviewSchema),
    interviewController.create
);

router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    interviewController.getAll
);

router.get(
    "/mine",
    authenticate,
    interviewController.getMine
);

router.get(
    "/:id",
    authenticate,
    interviewController.getById
);

router.patch(
    "/:id",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    validate(updateInterviewSchema),
    interviewController.update
);

router.patch(
    "/:id/feedback",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    validate(feedbackSchema),
    interviewController.submitFeedback
);

router.delete(
    "/:id",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    interviewController.cancel
);

export default router;
