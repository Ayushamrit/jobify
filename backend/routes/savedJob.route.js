import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getSavedJobs, saveJob, unsaveJob } from "../controllers/savedJob.controller.js";

const router = express.Router();

router.route("/save").post(isAuthenticated, saveJob);
router.route("/get").get(isAuthenticated, getSavedJobs);
router.route("/unsave/:jobId").delete(isAuthenticated, unsaveJob);

export default router;
