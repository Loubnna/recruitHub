import z from "zod";

export const createCompanySchema = z.object({
    name: z.string().min(1, "name is required"),
    description: z.string().min(1, "description is required"),
    location: z.string().min(1).optional(),
    website: z.url().optional(),
});

export const updateCompanySchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    website: z.url().optional(),
});