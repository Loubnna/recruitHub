import * as jobService from "./job.service.js";


export const create  = async (req, res )=> {

    try{
        const job= await jobService.createJob({
            ...req.body,
            authorId : req.user.id
        });
        return res.status(201).json({
            message : "job created ",
            job
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            message : "failed to create the job"
        });
    }
}



export const getAllJobs =async (req, res) =>{
    try{
        const jobs = await jobService.getAllJobs();
        return res.status(200).json(jobs);

    }catch(error){
        console.error(errro);
        return res.status(500 ).json({
            message : "Failed to fetch jobs "

        });

    }
}