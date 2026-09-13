import * as resumeServices from "./resume.services";
import { updateResumeSchema , updateResumeSchema} from "./resume.validation" ; 

export const upload =async (req , res )=>{
    try {
        const resume = await resumeServices.uploadResume({
            ...req.body,
            userid : req.user.id

        })

    }catch (error){
        console.error(error);
        return res.status(500).json({
            mesaage : "failed to upload resume"
        })
    }
}