import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";
import { SavedJob } from "../models/savedJob.model.js";

// In-memory chat history: Map<userId, [{role, parts}]>
const chatHistory = new Map();

const SYSTEM_PROMPT = `You are Jobify AI Assistant — a smart, friendly career helper embedded inside the Jobify job portal.

Your job is to help users with:
- How to apply for jobs on Jobify
- Explaining platform features (Job Seeker vs Recruiter accounts)
- Resume upload and profile completion tips
- Job search and filter guidance
- Application status and saved jobs questions
- Authentication help (login, signup, Google Sign-In)
- Interview preparation tips
- Career advice

Rules:
- Be concise, warm, and professional
- When you know the user's stats (applied jobs, saved jobs, profile completion), mention them
- Format responses clearly with bullet points when listing steps
- If asked something outside career/job topics, politely redirect to job-related help
- Never make up job listings or company data
`;

/**
 * POST /api/v1/ai/chat
 * Body: { message: string }
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

export const chat = async (req, res) => {
    try {
        const userId = req.id;
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: "Message is required", success: false });
        }

        // Fetch dynamic user context
        let contextBlock = "";
        try {
            const user = await User.findById(userId).select("fullname email role profile").lean();
            const appliedCount = await Application.countDocuments({ applicant: userId });
            const savedCount = await SavedJob.countDocuments({ user: userId });

            const profileComplete = [
                user?.profile?.bio,
                user?.profile?.skills?.length > 0,
                user?.profile?.resume,
                user?.profile?.github,
                user?.profile?.linkedin,
            ].filter(Boolean).length;
            const profilePct = Math.round((profileComplete / 5) * 100);

            contextBlock = `
[USER CONTEXT]
- Name: ${user?.fullname || "Unknown"}
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

        // Keep only last 10 exchanges to avoid token overflow
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
            console.error("Gemini API error:", errText);
            
            let parsedError;
            try { parsedError = JSON.parse(errText); } catch(e) {}
            
            const errorMessage = parsedError?.error?.message || "AI service temporarily unavailable";
            return res.status(502).json({ 
                message: `Gemini Error: ${errorMessage}`, 
                success: false,
                details: errText
            });
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

/**
 * DELETE /api/v1/ai/history  – clear chat history for current user
 */
export const clearHistory = (req, res) => {
    chatHistory.delete(req.id);
    return res.status(200).json({ message: "Chat history cleared", success: true });
};
