import express from "express";
import { generateAIResponse } from "../services/geminiService.js";
import { generateHFResponse } from "../services/huggingFaceService.js";
import { addMessage, getMessages, deleteMessages } from "../db/db.js";

const router = express.Router();

// GET chat history
router.get("/history", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User ID missing" });

    try {
        const history = await getMessages(userId);
        res.json(history);
    } catch (error) {
        console.error("History Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
});

// POST new message
router.post("/", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User ID missing" });

    const { message, provider = "huggingface", saveHistory = true } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        // Fetch last 10 messages for context (per user)
        const history = await getMessages(userId);
        const recentHistory = history.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
        }));

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

        // Save messages in database with userId (unless saveHistory is false)
        if (saveHistory !== false) {
            await addMessage(userId, { role: "user", content: message, timestamp: new Date() });
            await addMessage(userId, { role: "assistant", content: aiResponse, timestamp: new Date() });
        }

        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Router Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DELETE chat history
router.delete("/history", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User ID missing" });

    try {
        await deleteMessages(userId);
        res.json({ message: "Chat history cleared" });
    } catch (error) {
        console.error("Clear History Error:", error);
        res.status(500).json({ error: "Failed to clear chat history" });
    }
});

export default router;
