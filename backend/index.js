import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import reviewRoute from "./routes/review.route.js";
import savedJobRoute from "./routes/savedJob.route.js";
import aiRoute from "./routes/ai.route.js";

dotenv.config({});

const app = express();

app.set('trust proxy', 1); // Trust the first proxy (Render/Vercel)

const corsOptions = {
    origin: true, // Mirror the origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;


// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/saved-job", savedJobRoute);
app.use("/api/v1/ai", aiRoute);



// start server AFTER DB connects
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
});