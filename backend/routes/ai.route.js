import express from "express";
import { chat, clearHistory, getJobInsights } from "../controllers/ai.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/chat").post(isAuthenticated, chat);
router.route("/history").delete(isAuthenticated, clearHistory);
router.route("/job-insights").post(isAuthenticated, getJobInsights);

export default router;
