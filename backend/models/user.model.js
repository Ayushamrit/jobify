import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String }, // URL to resume file (Cloudinary)
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        },
        experience: [{
            companyName: { type: String, required: true },
            role: { type: String, required: true },
            startDate: { type: Date, required: true },
            endDate: { type: Date }, // Optional, null means present
            description: { type: String }
        }],
        education: [{
            institution: { type: String, required: true },
            degree: { type: String, required: true },
            fieldOfStudy: { type: String },
            startDate: { type: Date },
            endDate: { type: Date }
        }],
        github: { type: String },
        linkedin: { type: String }
    },
}, { timestamps: true });
export const User = mongoose.model('User', userSchema);