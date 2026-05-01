import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required: false // Optional for external jobs
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'accepted', 'rejected', 'Applied', 'Shortlisted', 'Interviewing', 'Selected'],
        default:'Applied'
    },
    isExternal: {
        type: Boolean,
        default: false
    },
    externalJobDetails: {
        title: String,
        company: String,
        logo: String,
        source: String,
        applyUrl: String
    },
    coverLetter: {
        type: String // Optional message to the recruiter
    },
    notes: {
        type: String,
        default: ""
    }
},{timestamps:true});
export const Application  = mongoose.model("Application", applicationSchema);