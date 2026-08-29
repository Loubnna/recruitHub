import prisma from "../../config/database.js";
import z from "zod";

const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "DZD"];


export const createJobSchema =z.object({
    title:z.string().min(1 , "title is required"),
    description : z.string().min(1 , "description is required"),
    location:z.string().min(1).optional(),
    salaryMin : z.number().int().nonnegative(),
    salaryMax:z.number().int().nonnegative(),
    currency : z.enum(SUPPORTED_CURRENCIES),
    status : z.enum(["draft", "published", "closed","ARCHIVED"]),
    companyId: z.number().int().positive()
}).refine((data) => data.salaryMax >= data.salaryMin, {
  message: "salaryMax must be greater than or equal to salaryMin",
  path: ["salaryMax"],
});

export const updateJobSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional(),
  currency: z.enum(SUPPORTED_CURRENCIES).optional(),
  status: z.enum(["draft", "published", "closed","ARCHIVED"]).optional(),
  companyId: z.string().min(1).optional(),
}).refine(
  (data) =>
    data.salaryMin === undefined ||
    data.salaryMax === undefined ||
    data.salaryMax >= data.salaryMin,
  {
    message: "salaryMax must be greater than or equal to salaryMin",
    path: ["salaryMax"],
  }
);