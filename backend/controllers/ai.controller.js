import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";
import { SavedJob } from "../models/savedJob.model.js";

const chatHistory = new Map();

const SYSTEM_PROMPT = `You are Jobify AI Assistant — a helpful, professional, and friendly career expert integrated into the Jobify portal.
Your goal is to assist job seekers and recruiters in navigating the platform and advancing their careers.

CONTEXT ABOUT THE PLATFORM:
- Jobify is a comprehensive job portal connecting students (job seekers) and recruiters.
* Job Seekers can: Search jobs (internal & external from Unstop/JSearch), save jobs, apply for jobs, and build their profile with a resume, bio, and skills.
* Recruiters can: Post jobs, manage companies, and view candidates.
* Core features: AI assistant, job tracking, saved jobs, and profile analysis.

YOUR CAPABILITIES:
- Answer questions about the Jobify platform.
- Help users find jobs based on their profile.
- Provide career advice, resume tips, and interview preparation.
- Analyze user "stats" (applied/saved jobs) to provide personalized recommendations.
- Keep responses professional, encouraging, and relatively concise (max 2-3 paragraphs).

USER CONTEXT:
The user's current platform data is provided below. Use this to personalize your answers.
[START CONTEXT]
`;

/**
 * POST /api/v1/ai/job-insights
 * Body: { jobTitle, jobDescription, jobRequirements }
 */
export const getJobInsights = async (req, res) => {
    try {
        const userId = req.id;
        const { jobTitle, jobDescription, jobRequirements } = req.body;

        if (!jobTitle || !jobDescription) {
            return res.status(400).json({ message: "Job details are required", success: false });
        }

        const user = await User.findById(userId).select("fullname profile").lean();
        
        const prompt = `
            Analyze this job for ${user?.fullname || 'the user'}:
            
            JOB TITLE: ${jobTitle}
            REQUIREMENTS: ${jobRequirements || 'Not specified'}
            DESCRIPTION: ${jobDescription}
            
            USER PROFILE:
            Bio: ${user?.profile?.bio || 'Not provided'}
            Skills: ${user?.profile?.skills?.join(', ') || 'None listed'}
            
            Provide a very concise (max 3 sentences) personalized analysis. 
            1. Is it a good fit? 
            2. What skill should they highlight?
            3. A quick tip for applying.
        `;

        const apiKey = process.env.GEMINI_API_KEY?.trim();
        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.5, maxOutputTokens: 200 }
                })
            }
        );

        if (!geminiRes.ok) throw new Error("Gemini API error");

        const data = await geminiRes.json();
        const insight = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No insights available.";

        return res.status(200).json({ insight, success: true });
    } catch (error) {
        console.error("AI Insight error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

/**
 * POST /api/v1/ai/chat
 * Body: { message: string }
 */
export const chat = async (req, res) => {
    try {
        const userId = req.id;
        const { message } = req.body;

        if (!message) return res.status(400).json({ message: "Message is required", success: false });

        // Build context block from DB
        let contextBlock = "";
        try {
            const user = await User.findById(userId).select("fullname email role profile").lean();
            const appliedCount = await Application.countDocuments({ applicant: userId });
            const savedCount = await SavedJob.countDocuments({ user: userId });
            
            const totalProfileFields = 4; // fullname, bio, skills, resume
            let filledFields = 1; // fullname is required
            if (user?.profile?.bio) filledFields++;
            if (user?.profile?.skills?.length > 0) filledFields++;
            if (user?.profile?.resume) filledFields++;
            const profilePct = Math.round((filledFields / totalProfileFields) * 100);

            contextBlock = `
- Name: ${user?.fullname}
- Role: ${user?.role === 'student' ? 'Job Seeker' : 'Recruiter'}
- Applied Jobs: ${appliedCount}
- Saved Jobs: ${savedCount}
- Profile Completion: ${profilePct}%
- Has Resume: ${user?.profile?.resume ? "Yes" : "No"}
- Bio: ${user?.profile?.bio || "Not set"}
[END CONTEXT]
`;
        } catch (ctxErr) {
            console.error("Context fetch error:", ctxErr.message);
        }

        // Get or init conversation history
        if (!chatHistory.has(userId)) {
            chatHistory.set(userId, []);
        }
        const history = chatHistory.get(userId);

        // Append user message to history
        history.push({ role: "user", parts: [{ text: message }] });

        // Keep only last 20 exchanges
        if (history.length > 20) history.splice(0, history.length - 20);

        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (!apiKey || apiKey === "YOUR_GEMINI_KEY_HERE") {
            return res.status(500).json({
                message: "AI service not configured. Please add GEMINI_API_KEY to backend .env",
                success: false
            });
        }

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: SYSTEM_PROMPT + contextBlock }]
                    },
                    contents: history,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    }
                })
            }
        );

        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            let parsedError;
            try { parsedError = JSON.parse(errText); } catch(e) {}
            const errorMessage = parsedError?.error?.message || "AI service temporarily unavailable";
            return res.status(502).json({ message: `Gemini Error: ${errorMessage}`, success: false });
        }

        const geminiData = await geminiRes.json();
        const aiText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text
            || "I'm having trouble responding right now. Please try again!";

        // Append AI response to history
        history.push({ role: "model", parts: [{ text: aiText }] });

        return res.status(200).json({ reply: aiText, success: true });
    } catch (error) {
        console.error("AI chat error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const clearHistory = (req, res) => {
    chatHistory.delete(req.id);
    return res.status(200).json({ message: "Chat history cleared", success: true });
};
