import prisma from "../../config/database.js";

const applicationSelect = {
    id: true,
    status: true,
    createdAt: true,
    candidateId: true,
    jobOfferId: true
};

export const createApplication = async ({ jobOfferId, candidateId }) => {
    const job = await prisma.jobOffer.findUnique({
        where: { id: jobOfferId }
    });

    if (!job) {
        const error = new Error("Job not found");
        error.statusCode = 404;
        throw error;
    }

    const existing = await prisma.application.findUnique({
        where: {
            candidateId_jobOfferId: {
                candidateId,
                jobOfferId
            }
        }
    });

    if (existing) {
        const error = new Error("You already applied to this job");
        error.statusCode = 409;
        throw error;
    }

    return await prisma.application.create({
        data: {
            jobOfferId,
            candidateId
        },
        select: applicationSelect
    });
};

export const getAllApplications = async () => {
    return await prisma.application.findMany({
        select: applicationSelect
    });
};

export const getApplicationById = async (id) => {
    return await prisma.application.findUnique({
        where: { id },
        select: applicationSelect
    });
};

export const getApplicationsByCandidate = async (candidateId) => {
    return await prisma.application.findMany({
        where: { candidateId },
        select: applicationSelect
    });
};

export const getApplicationsByJob = async (jobOfferId, user) => {
    const job = await prisma.jobOffer.findUnique({
        where: { id: jobOfferId }
    });

    if (!job) {
        const error = new Error("Job not found");
        error.statusCode = 404;
        throw error;
    }

    // Admin can view applications for any job
    // Recruiter can only view applications for their own job
    if (user.role !== "ADMIN" && job.authorId !== user.id) {
        const error = new Error("You are not allowed to view these applications");
        error.statusCode = 403;
        throw error;
    }

    return await prisma.application.findMany({
        where: { jobOfferId },
        select: applicationSelect
    });
};

export const updateApplicationStatus = async (id, status, user) => {
    const application = await prisma.application.findUnique({
        where: { id },
        include: { jobOffer: true }
    });

    if (!application) {
        const error = new Error("Application not found");
        error.statusCode = 404;
        throw error;
    }

    // Admin can update any application
    // Recruiter can only update applications for jobs they own
    if (user.role !== "ADMIN" && application.jobOffer.authorId !== user.id) {
        const error = new Error("You are not allowed to update this application");
        error.statusCode = 403;
        throw error;
    }

    return await prisma.application.update({
        where: { id },
        data: { status },
        select: applicationSelect
    });
};

export const deleteApplication = async (id, user) => {
    const application = await prisma.application.findUnique({
        where: { id }
    });

    if (!application) {
        const error = new Error("Application not found");
        error.statusCode = 404;
        throw error;
    }

    // Admin can withdraw any application
    // Candidate can only withdraw their own application
    if (user.role !== "ADMIN" && application.candidateId !== user.id) {
        const error = new Error("You are not allowed to withdraw this application");
        error.statusCode = 403;
        throw error;
    }

    return await prisma.application.delete({
        where: { id }
    });
};