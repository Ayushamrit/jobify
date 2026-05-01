import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        const { coverLetter } = req.body;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
            coverLetter
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log("Error in applyJob:", error);
        return res.status(500).json({ message: "Failed to apply for job.", success: false, error: error.message });
    }
};

export const logExternalApplication = async (req, res) => {
    try {
        const userId = req.id;
        const { title, company, logo, source, applyUrl } = req.body;

        if (!title || !company || !source || !applyUrl) {
            return res.status(400).json({
                message: "Missing job details.",
                success: false
            });
        }

        // Check if already logged (avoid duplicates)
        const existing = await Application.findOne({
            applicant: userId,
            isExternal: true,
            'externalJobDetails.applyUrl': applyUrl
        });

        if (existing) {
            return res.status(200).json({
                message: "Application already tracked.",
                success: true,
                application: existing
            });
        }

        const application = await Application.create({
            applicant: userId,
            isExternal: true,
            externalJobDetails: { title, company, logo, source, applyUrl },
            status: 'Applied'
        });

        return res.status(201).json({
            message: "Application logged successfully.",
            success: true,
            application
        });
    } catch (error) {
        console.log("Error in logExternalApplication:", error);
        return res.status(500).json({ message: "Failed to log application.", success: false });
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log("Error in getAppliedJobs:", error);
        return res.status(500).json({ message: "Failed to get applied jobs.", success: false, error: error.message });
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log("Error in getApplicants:", error);
        return res.status(500).json({ message: "Failed to get applicants.", success: false, error: error.message });
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status, notes} = req.body;
        const applicationId = req.params.id;
        if(!status && notes === undefined){
            return res.status(400).json({
                message:'status or notes is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status and notes
        if (status) application.status = status;
        if (notes !== undefined) application.notes = notes;
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true,
            application
        });

    } catch (error) {
        console.log("Error in updateStatus:", error);
        return res.status(500).json({ message: "Failed to update status.", success: false, error: error.message });
    }
}