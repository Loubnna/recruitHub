import z from "zod";

export const uploadResumeSchema = z.object({
  fileName: z.string().min(1),
});
export const updateResumeSchema = z.object({
  fileName: z.string().min(1).optional(),
});