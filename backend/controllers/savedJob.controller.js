import { SavedJob } from "../models/savedJob.model.js";

export const saveJob = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId, title, company, location, logo, platform, applyUrl, jobType, salary } = req.body;

        if (!jobId || !title || !platform) {
            return res.status(400).json({
                message: "Missing required job details",
                success: false
            });
        }

        // Check if already saved
        const existing = await SavedJob.findOne({ user: userId, jobId });
        if (existing) {
            return res.status(400).json({
                message: "Job already saved",
                success: false
            });
        }

        const savedJob = await SavedJob.create({
            user: userId,
            jobId,
            title,
            company,
            location,
            logo,
            platform,
            applyUrl,
            jobType,
            salary
        });

        return res.status(201).json({
            message: "Job saved successfully",
            savedJob,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const savedJobs = await SavedJob.find({ user: userId }).sort({ savedAt: -1 });

        return res.status(200).json({
            savedJobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const unsaveJob = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId } = req.params;

        await SavedJob.findOneAndDelete({ user: userId, jobId });

        return res.status(200).json({
            message: "Job removed from saved",
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
