import prisma from "../../config/database.js";
import z from "zod";


export const registerScema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100)

});
export const loginScema = z.object({
    email: z.string().email(),
    password: z.string().min(1)

})