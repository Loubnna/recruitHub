import * as jobService from "./job.service.js";
import {createJobSchema , updateJobSchema} from "./job.validation.js"

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



export const getAll = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await jobService.getAllJobs(page, limit);

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      message: "Failed to get jobs"
    });
  }
};
export const getById =async (req , res ) =>{
    try{
        const id =Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
            message: "Invalid job ID"
    });
    }



        const job = await jobService.getJobById(id);
        if (! job) {
            return res.status(404).json({message : "job not found" });
        }
        return res.status(200).json({
            job
        });

    }catch (error){
        console.error(error);
        res.status(500).json({message : "failed to fetch job"})
    }
}

export const update = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const parsed = updateJobSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                errors: parsed.error.flatten()
            });
        }

        const updatedJob = await jobService.updateJob(
            id,
            parsed.data,
            req.user
        );

        return res.status(200).json(updatedJob);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to update job"
        });
    }
};
export const deleteJob = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const deletedJob = await jobService.deleteJob(
            id,
            req.user
        );

        return res.status(200).json({
            message: "Job deleted successfully",
            job: deletedJob
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to delete the job"
        });
    }
};