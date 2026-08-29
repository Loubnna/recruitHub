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
export const getJobById =async () =>{
    return await prisma.jobOffer.findUnique;

}; 
export const updateJob = async () =>{

};
export const deleteJob = async () =>{

};