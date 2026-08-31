import z from "zod";

export const createApplicationSchema = z.object({
    jobOfferId: z.number().int().positive("jobOfferId is required"),
});