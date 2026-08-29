import prisma from "../../config/database.js";
import z from "zod";


export const createJob = async ({title, description ,location ,salaryMin,salaryMax, currency , companyId}) =>{
    const newJob = await prisma.jobOffer.create({
        data: {
            title,
            description ,
            location ,
            salaryMin,
            salaryMax,
            currency ,
            companyId,
            authorId
           
        },
        select: {
            id: true,
            title: true,
            description: true,
            location: true,
            salaryMin: true,
            salaryMax: true,
            currency: true,
            status: true,
            companyId: true,
            authorId: true,
            createdAt: true
        }

        
    });
    return newJob;
}
export const getAllJobs =async () =>{
    return await prisma.jobOffer.findMany({
        select : {
            id: true,
            title: true,
            description: true,
            location: true,
            salaryMin: true,
            salaryMax: true,
            currency: true,
            status: true,
            companyId: true,
            authorId: true,
            createdAt: true,
            updatedAt: true


        }
    });

};
export const getJobById =async (id) =>{
    return await prisma.jobOffer.findUnique({
        where : { id },
    });
    

};

export const updateJob = async (id, data, user) => {
    const job = await prisma.jobOffer.findUnique({
        where: { id }
    });

    if (!job) {
        const error = new Error("Job not found");
        error.statusCode = 404;
        throw error;
    }

    // Admin can update any job
    // Recruiter can update only their own job
    if (user.role !== "ADMIN" && job.authorId !== user.id) {
        const error = new Error("You are not allowed to update this job");
        error.statusCode = 403;
        throw error;
    }

    return await prisma.jobOffer.update({
        where: { id },
        data
    });
};

export const deleteJob = async (id, user) => {
    const job = await prisma.jobOffer.findUnique({
        where: { id }
    });

    if (!job) {
        const error = new Error("Job not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role !== "ADMIN" && job.authorId !== user.id) {
        const error = new Error("You are not allowed to delete this job");
        error.statusCode = 403;
        throw error;
    }

    return await prisma.jobOffer.delete({
        where: { id }
    });
};