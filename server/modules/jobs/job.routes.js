import express from "express";
import * as jobController from "./job.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import {authorize} from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createJob, updateJob } from "./job.service.js";
import {createJobSchema , updateJobSchema} from "./job.validation.js"


const router = express.Router();

router.post("/",
    authenticate,
    authorize("RECRUITER"),
    validate(createJobSchema),
    jobController.create
);

router.get("/",
    jobController.getAll
);

router.get("/:id",
    jobController.getById
);
router.patch("/:id",
     authenticate,
    authorize("RECRUITER", "ADMIN"),
    validate(updateJobSchema),
    jobController.update

);
router.delete(
    "/:id",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    jobController.deleteJob
);
export default router;