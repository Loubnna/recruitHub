import * as interviewService from "./interview.service.js";

export const create = async (req, res, next) => {
    try {
        const interview = await interviewService.createInterview(req.body, req.user);

        return res.status(201).json({
            message: "Interview scheduled",
            interview
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const interviews = await interviewService.getAllInterviews();

        return res.status(200).json(interviews);
    } catch (error) {
        next(error);
    }
};

export const getMine = async (req, res, next) => {
    try {
        const interviews = await interviewService.getInterviewsForUser(req.user);

        return res.status(200).json(interviews);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid interview ID"
            });
        }

        const interview = await interviewService.getInterviewById(id, req.user);

        return res.status(200).json({ interview });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid interview ID"
            });
        }

        const interview = await interviewService.updateInterview(id, req.body, req.user);

        return res.status(200).json({
            message: "Interview updated",
            interview
        });
    } catch (error) {
        next(error);
    }
};

export const submitFeedback = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid interview ID"
            });
        }

        const interview = await interviewService.submitFeedback(id, req.body, req.user);

        return res.status(200).json({
            message: "Feedback submitted",
            interview
        });
    } catch (error) {
        next(error);
    }
};

export const cancel = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid interview ID"
            });
        }

        const interview = await interviewService.cancelInterview(id, req.user);

        return res.status(200).json({
            message: "Interview cancelled",
            interview
        });
    } catch (error) {
        next(error);
    }
};
