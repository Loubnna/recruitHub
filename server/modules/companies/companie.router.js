import express from "express";
import * as companyController from "./company.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createCompanySchema, updateCompanySchema } from "./company.validation.js";

const router = express.Router();

router.post("/",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    validate(createCompanySchema),
    companyController.create
);

router.get("/",
    companyController.getAll
);

router.get("/:id",
    companyController.getById
);

router.patch("/:id",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    validate(updateCompanySchema),
    companyController.update
);

router.delete("/:id",
    authenticate,
    authorize("RECRUITER", "ADMIN"),
    companyController.remove
);

export default router;