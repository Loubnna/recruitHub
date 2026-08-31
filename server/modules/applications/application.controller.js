import * as applicationService from "./application.service.js";
import { createApplicationSchema, updateApplicationStatusSchema } from "./application.validation.js";

export const create = async (req, res) => {
    try {
        const parsed = createApplicationSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                errors: parsed.error.flatten()
            });
        }

        const application = await applicationService.createApplication({
            ...parsed.data,
            candidateId: req.user.id
        });

        return res.status(201).json({
            message: "application submitted",
            application
        });

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "failed to submit the application"
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const applications = await applicationService.getAllApplications();
        return res.status(200).json(applications);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch applications"
        });
    }
};

export const getMine = async (req, res) => {
    try {
        const applications = await applicationService.getApplicationsByCandidate(req.user.id);
        return res.status(200).json(applications);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch your applications"
        });
    }
};

export const getByJob = async (req, res) => {
    try {
        const jobOfferId = Number(req.params.jobId);

        if (!Number.isInteger(jobOfferId) || jobOfferId <= 0) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const applications = await applicationService.getApplicationsByJob(jobOfferId, req.user);
        return res.status(200).json(applications);

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Failed to fetch applications for this job"
        });
    }
};

export const getById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid application ID"
            });
        }

        const application = await applicationService.getApplicationById(id);

        if (!application) {
            return res.status(404).json({ message: "application not found" });
        }

        // Admin can view any application
        // Candidate can only view their own application
        if (req.user.role !== "ADMIN" && application.candidateId !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to view this application"
            });
        }

        return res.status(200).json({ application });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "failed to fetch application" });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid application ID"
            });
        }

        const parsed = updateApplicationStatusSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                errors: parsed.error.flatten()
            });
        }

        const updatedApplication = await applicationService.updateApplicationStatus(
            id,
            parsed.data.status,
            req.user
        );

        return res.status(200).json(updatedApplication);

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Failed to update application status"
        });
    }
};

export const remove = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid application ID"
            });
        }

        const deletedApplication = await applicationService.deleteApplication(
            id,
            req.user
        );

        return res.status(200).json({
            message: "Application withdrawn successfully",
            application: deletedApplication
        });

    } catch (error) {
        console.error(error);
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Failed to withdraw the application"
        });
    }
};