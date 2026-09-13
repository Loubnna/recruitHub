import * as resumeServices from "./resume.services.js";
import { saveResumeFile, deleteResumeFile } from "../../utils/storage.js";

export const upload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const fileKey = saveResumeFile(req.file.buffer, req.file.originalname);

        const resume = await resumeServices.uploadResume({
            userId: req.user.id,
            fileName: req.file.originalname,
            fileKey,
            fileSize: req.file.size,
            mimeType: req.file.mimetype
        });

        return res.status(201).json({
            message: "Resume uploaded",
            resume
        });
    } catch (error) {
        next(error);
    }
};

export const getMine = async (req, res, next) => {
    try {
        const resume = await resumeServices.getResumeByUserId(req.user.id);
        return res.status(200).json({ resume });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const existing = await resumeServices.getResumeByUserId(req.user.id);

        const fileKey = saveResumeFile(req.file.buffer, req.file.originalname);

        const updatedResume = await resumeServices.updateResume({
            id: existing.id,
            fileName: req.file.originalname,
            fileKey,
            fileSize: req.file.size,
            mimeType: req.file.mimetype
        });

        deleteResumeFile(existing.fileKey); // clean up old file after success

        return res.status(200).json({
            message: "Resume updated",
            resume: updatedResume
        });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const deleted = await resumeServices.deleteResume(req.user.id);
        deleteResumeFile(deleted.fileKey);

        return res.status(200).json({
            message: "Resume deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};