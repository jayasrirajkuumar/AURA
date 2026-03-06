import express from "express";
import { generateAIResponse } from "../services/geminiService.js";
import { generateHFResponse } from "../services/huggingFaceService.js";
import { addMessage, getMessages } from "../db/db.js";

const router = express.Router();

// GET chat history
router.get("/history", async (req, res) => {
    try {
        const history = await getMessages();
        res.json(history);
    } catch (error) {
        console.error("History Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
});

// POST new message
router.post("/", async (req, res) => {
    const { message, provider = "huggingface" } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        // Fetch last 10 messages for context
        const history = await getMessages();
        const recentHistory = history.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Add the current user message to the history we send to the AI
        recentHistory.push({ role: "user", content: message });

        let aiResponse;
        try {
            if (provider === "huggingface") {
                aiResponse = await generateHFResponse(recentHistory);
            } else {
                aiResponse = await generateAIResponse(message);
            }
        } catch (error) {
            console.error(`Primary AI Provider (${provider}) failed, trying fallback...`);
            if (provider === "huggingface") {
                aiResponse = await generateAIResponse(message);
            } else {
                aiResponse = await generateHFResponse(recentHistory);
            }
        }

        // Save messages in database
        await addMessage({ role: "user", content: message, timestamp: new Date() });
        await addMessage({ role: "assistant", content: aiResponse, timestamp: new Date() });

        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Router Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
