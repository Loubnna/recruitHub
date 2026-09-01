import z from "zod";

export const createApplicationSchema = z.object({
    jobOfferId: z.number().int().positive("jobOfferId is required"),
});

export const updateApplicationStatusSchema = z.object({
    status: z.enum([
        "PENDING",
        "REVIEWING",
        "INTERVIEWED",
        "ACCEPTED",
        "REJECTED"
    ]),
});