import prisma from "../../config/database.js";
import AppError from "../../utils/appError.js";

const interviewSelect = {
    id: true,
    applicationId: true,
    interviewerId: true,
    scheduledAt: true,
    durationMins: true,
    meetingLink: true,
    location: true,
    status: true,
    feedback: true,
    rating: true,
    createdAt: true,
    updatedAt: true
};

const interviewWithRelations = {
    ...interviewSelect,
    application: {
        select: {
            id: true,
            status: true,
            candidateId: true,
            jobOfferId: true,
            candidate: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            jobOffer: {
                select: {
                    id: true,
                    title: true,
                    authorId: true,
                    companyId: true
                }
            }
        }
    },
    interviewer: {
        select: {
            id: true,
            name: true,
            email: true
        }
    }
};

const getApplicationForInterview = async (applicationId) => {
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
            jobOffer: true,
            interview: true
        }
    });

    if (!application) {
        throw new AppError("Application not found", 404);
    }

    return application;
};

const assertCanManageJobApplication = (application, user) => {
    if (user.role === "ADMIN") {
        return;
    }

    if (user.role === "RECRUITER" && application.jobOffer.authorId === user.id) {
        return;
    }

    throw new AppError("You are not allowed to manage interviews for this application", 403);
};

const assertCanViewInterview = (interview, user) => {
    if (user.role === "ADMIN") {
        return;
    }

    if (user.role === "CANDIDATE" && interview.application.candidateId === user.id) {
        return;
    }

    if (
        user.role === "RECRUITER" &&
        (interview.interviewerId === user.id ||
            interview.application.jobOffer.authorId === user.id)
    ) {
        return;
    }

    throw new AppError("You are not allowed to view this interview", 403);
};

export const createInterview = async (
    { applicationId, scheduledAt, durationMins, meetingLink, location, interviewerId },
    user
) => {
    const application = await getApplicationForInterview(applicationId);

    assertCanManageJobApplication(application, user);

    if (application.interview) {
        throw new AppError("An interview is already scheduled for this application", 409);
    }

    const resolvedInterviewerId = interviewerId ?? user.id;

    if (user.role !== "ADMIN" && resolvedInterviewerId !== user.id) {
        throw new AppError("You can only schedule yourself as the interviewer", 403);
    }

    const interviewer = await prisma.user.findUnique({
        where: { id: resolvedInterviewerId }
    });

    if (!interviewer) {
        throw new AppError("Interviewer not found", 404);
    }

    if (interviewer.role !== "RECRUITER" && interviewer.role !== "ADMIN") {
        throw new AppError("Interviewer must be a recruiter or admin", 400);
    }

    const [interview] = await prisma.$transaction([
        prisma.interview.create({
            data: {
                applicationId,
                interviewerId: resolvedInterviewerId,
                scheduledAt: new Date(scheduledAt),
                durationMins,
                meetingLink,
                location
            },
            select: interviewSelect
        }),
        prisma.application.update({
            where: { id: applicationId },
            data: { status: "INTERVIEWED" }
        })
    ]);

    return interview;
};

export const getAllInterviews = async () => {
    return await prisma.interview.findMany({
        select: interviewWithRelations,
        orderBy: { scheduledAt: "desc" }
    });
};

export const getInterviewsForUser = async (user) => {
    if (user.role === "CANDIDATE") {
        return await prisma.interview.findMany({
            where: {
                application: {
                    candidateId: user.id
                }
            },
            select: interviewWithRelations,
            orderBy: { scheduledAt: "desc" }
        });
    }

    if (user.role === "RECRUITER") {
        return await prisma.interview.findMany({
            where: {
                OR: [
                    { interviewerId: user.id },
                    { application: { jobOffer: { authorId: user.id } } }
                ]
            },
            select: interviewWithRelations,
            orderBy: { scheduledAt: "desc" }
        });
    }

    return await getAllInterviews();
};

export const getInterviewById = async (id, user) => {
    const interview = await prisma.interview.findUnique({
        where: { id },
        select: interviewWithRelations
    });

    if (!interview) {
        throw new AppError("Interview not found", 404);
    }

    assertCanViewInterview(interview, user);

    return interview;
};

export const updateInterview = async (id, data, user) => {
    const interview = await prisma.interview.findUnique({
        where: { id },
        include: {
            application: {
                include: { jobOffer: true }
            }
        }
    });

    if (!interview) {
        throw new AppError("Interview not found", 404);
    }

    assertCanManageJobApplication(interview.application, user);

    if (interview.status === "COMPLETED" && data.status !== "CANCELLED") {
        throw new AppError("Completed interviews cannot be modified", 400);
    }

    const updateData = {};

    if (data.scheduledAt !== undefined) {
        updateData.scheduledAt = new Date(data.scheduledAt);
    }
    if (data.durationMins !== undefined) {
        updateData.durationMins = data.durationMins;
    }
    if (data.meetingLink !== undefined) {
        updateData.meetingLink = data.meetingLink;
    }
    if (data.location !== undefined) {
        updateData.location = data.location;
    }
    if (data.status !== undefined) {
        updateData.status = data.status;
    }

    return await prisma.interview.update({
        where: { id },
        data: updateData,
        select: interviewSelect
    });
};

export const submitFeedback = async (id, { feedback, rating }, user) => {
    const interview = await prisma.interview.findUnique({
        where: { id },
        include: {
            application: {
                include: { jobOffer: true }
            }
        }
    });

    if (!interview) {
        throw new AppError("Interview not found", 404);
    }

    assertCanManageJobApplication(interview.application, user);

    if (interview.status === "CANCELLED") {
        throw new AppError("Cannot submit feedback for a cancelled interview", 400);
    }

    return await prisma.interview.update({
        where: { id },
        data: {
            feedback,
            rating,
            status: "COMPLETED"
        },
        select: interviewSelect
    });
};

export const cancelInterview = async (id, user) => {
    const interview = await prisma.interview.findUnique({
        where: { id },
        include: {
            application: {
                include: { jobOffer: true }
            }
        }
    });

    if (!interview) {
        throw new AppError("Interview not found", 404);
    }

    assertCanManageJobApplication(interview.application, user);

    if (interview.status === "COMPLETED") {
        throw new AppError("Completed interviews cannot be cancelled", 400);
    }

    if (interview.status === "CANCELLED") {
        throw new AppError("Interview is already cancelled", 400);
    }

    return await prisma.interview.update({
        where: { id },
        data: { status: "CANCELLED" },
        select: interviewSelect
    });
};
