import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobId: {
        type: String, // Can be MongoDB ID or external ID (ext_...)
        required: true
    },
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        default: 'Unknown'
    },
    location: {
        type: String
    },
    logo: {
        type: String
    },
    platform: {
        type: String, // e.g., 'Unstop', 'Naukri', 'Jobify'
        required: true
    },
    applyUrl: {
        type: String
    },
    jobType: {
        type: String
    },
    salary: {
        type: String
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
});

export const SavedJob = mongoose.model("SavedJob", savedJobSchema);
