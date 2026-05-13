import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import admin from "../utils/firebase-admin.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let cloudResponse;
        if (req.file) {
            const file = req.file;
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse ? cloudResponse.secure_url : "",
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, experience, education, github, linkedin } = req.body;

        let cloudResponse;
        if (req.file) {
            const file = req.file;
            const fileUri = getDataUri(file);
            // Cloudinary supports PDF uploads if resource_type is set to 'raw' or 'auto'
            cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: 'auto' });
        }

        let skillsArray;
        if (skills) {
            skillsArray = typeof skills === 'string' ? skills.split(",") : skills;
        }

        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;
        if (github) user.profile.github = github;
        if (linkedin) user.profile.linkedin = linkedin;

        // Parse JSON strings if experience/education are sent as form-data
        if (experience) {
            user.profile.experience = typeof experience === 'string' ? JSON.parse(experience) : experience;
        }
        if (education) {
            user.profile.education = typeof education === 'string' ? JSON.parse(education) : education;
        }

        // resume comes later here...
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = req.file.originalname // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.log("Error in updateProfile:", error);
        return res.status(500).json({
            message: "Failed to update profile.",
            success: false,
            error: error.message
        });
    }
}

export const googleLogin = async (req, res) => {
    try {
        const { fullname, email, profilePhoto, role, idToken } = req.body;

        if (!email || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Verify Firebase ID Token if provided
        if (idToken && admin.apps.length > 0) {
            try {
                const decodedToken = await admin.auth().verifyIdToken(idToken);
                if (decodedToken.email !== email) {
                    return res.status(401).json({
                        message: "Invalid token email match",
                        success: false
                    });
                }
            } catch (authError) {
                console.error("Firebase Auth Error:", authError.message);
                return res.status(401).json({
                    message: "Authentication failed. Please try again.",
                    success: false
                });
            }
        } else if (!idToken && admin.apps.length > 0) {
            return res.status(401).json({
                message: "Authentication token is required.",
                success: false
            });
        } else {
            console.warn("Skipping Firebase token verification (Admin SDK not configured).");
        }

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if not exists
            user = await User.create({
                fullname,
                email,
                phoneNumber: 0, // Placeholder for Google users
                role,
                profile: {
                    profilePhoto: profilePhoto || ""
                }
            });
        } else {
            // Check if role matches if user already exists
            if (role !== user.role) {
                return res.status(400).json({
                    message: "Account doesn't exist with current role.",
                    success: false
                })
            };
        }

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user: userData,
            success: true
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const getCandidates = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        // Find users with role 'student'
        // If keyword is provided, search in fullname, email, or skills
        const query = {
            role: "student",
            $or: [
                { fullname: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
                { "profile.skills": { $regex: keyword, $options: "i" } }
            ]
        };

        const candidates = await User.find(query).select("-password").sort({ createdAt: -1 });

        return res.status(200).json({
            candidates,
            success: true
        });
    } catch (error) {
        console.log("Error in getCandidates:", error);
        return res.status(500).json({
            message: "Failed to get candidates.",
            success: false,
            error: error.message
        });
    }
}
