import express from "express";
import { addMood, getMoods } from "../db/db.js";

const router = express.Router();

// GET mood history
router.get("/history", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User ID missing" });

    try {
        const history = await getMoods(userId);
        res.json(history);
    } catch (error) {
        console.error("Mood History Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch mood history" });
    }
});

// POST new mood log
router.post("/", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User ID missing" });

    const { mood, note } = req.body;

    if (!mood) {
        return res.status(400).json({ error: "Mood is required" });
    }

    try {
        await addMood(userId, { mood, note });
        res.json({ success: true, message: "Mood logged successfully" });
    } catch (error) {
        console.error("Mood Log Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
