import z from "zod";

export const createInterviewSchema = z.object({
    applicationId: z.number().int().positive(),
    scheduledAt: z.string().datetime(),
    durationMins: z.number().int().positive().optional(),
    meetingLink: z.string().url().optional(),
    location: z.string().optional(),
    interviewerId: z.number().int().positive().optional()
});

export const updateInterviewSchema = z.object({
    scheduledAt: z.string().datetime().optional(),
    durationMins: z.number().int().positive().optional(),
    meetingLink: z.string().url().nullable().optional(),
    location: z.string().nullable().optional(),
    status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional()
});

export const feedbackSchema = z.object({
    feedback: z.string().min(1),
    rating: z.number().int().min(1).max(5).optional()
});
