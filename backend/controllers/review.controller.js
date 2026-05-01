import { Review } from "../models/review.model.js";
import { Company } from "../models/company.model.js";

export const addReview = async (req, res) => {
    try {
        const { rating, reviewText } = req.body;
        const companyId = req.params.id;
        const userId = req.id;

        if (!rating || !reviewText) {
            return res.status(400).json({
                message: "Rating and review text are required.",
                success: false
            });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        // Check if user already reviewed this company
        const existingReview = await Review.findOne({ company: companyId, user: userId });
        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this company.",
                success: false
            });
        }

        const review = await Review.create({
            company: companyId,
            user: userId,
            rating,
            reviewText
        });

        return res.status(201).json({
            message: "Review added successfully.",
            review,
            success: true
        });

    } catch (error) {
        console.log("Error in addReview:", error);
        return res.status(500).json({
            message: "Failed to add review.",
            success: false,
            error: error.message
        });
    }
};

export const getCompanyReviews = async (req, res) => {
    try {
        const companyId = req.params.id;
        const reviews = await Review.find({ company: companyId })
            .populate({ path: "user", select: "fullname profile.profilePhoto" })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            reviews,
            success: true
        });
    } catch (error) {
        console.log("Error in getCompanyReviews:", error);
        return res.status(500).json({
            message: "Failed to get reviews.",
            success: false,
            error: error.message
        });
    }
};
