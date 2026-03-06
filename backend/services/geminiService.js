import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIResponse = async (userMessage) => {
    try {
        // Using a more standard way to initialize the model
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const systemPrompt = "You are Aura, a compassionate AI mental wellness companion. Respond with warmth, empathy, and supportive language. Encourage reflection and emotional awareness. Avoid clinical diagnosis. Keep responses concise but meaningful.";

        // Using simple generateContent with system context prepended
        const prompt = `${systemPrompt}\n\nUser: ${userMessage}\nAura:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini AI API Error:", error.message);
        if (error.message?.includes("429")) {
            return "I'm receiving a lot of requests right now. Let me take a deep breath and I'll be back in a moment.";
        }
        throw new Error("Failed to generate AI response");
    }
};
