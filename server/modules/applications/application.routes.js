import express from "express";
import * as applicationController from "./application.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createApplicationSchema , updateApplicationStatusSchema } from "./application.validation.js";

const router = express.Router();

router.post("/",
    authenticate,
    authorize("CANDIDATE"),
    validate(createApplicationSchema),
    applicationController.create
);

router.get("/",
    authenticate,
    authorize("ADMIN"),
    applicationController.getAll
);

router.get("/mine",
    authenticate,
    authorize("CANDIDATE"),
    applicationController.getMine
);

router.get("/job/:jobId",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    applicationController.getByJob
);

router.get("/:id",
    authenticate,
    applicationController.getById
);

router.patch("/:id",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    validate(updateApplicationStatusSchema),
    applicationController.updateStatus
);

router.delete("/:id",
    authenticate,
    authorize("CANDIDATE", "ADMIN"),
    applicationController.remove
);

export default router;