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

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'http://localhost:3000',
        'http://127.0.0.1:5173', 
        process.env.FRONTEND_URL, // Your Vercel URL added in Render dashboard
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/savedjob", savedJobRoute);
app.use("/api/v1/ai", aiRoute);



// start server AFTER DB connects
connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`✅ API Base: http://localhost:${PORT}/api/v1`);
    });
}).catch(err => {
    console.error("❌ Failed to start server:", err);
});