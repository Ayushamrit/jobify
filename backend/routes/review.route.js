import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { addReview, getCompanyReviews } from "../controllers/review.controller.js";

const router = express.Router();

router.route("/:id").post(isAuthenticated, addReview);
router.route("/:id").get(isAuthenticated, getCompanyReviews);

export default router;
