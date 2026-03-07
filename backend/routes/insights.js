import express from "express";
import { getMoods } from "../db/db.js";
import { getSleepLogs } from "../db/db.js";
import { generateInsight } from "../services/huggingFaceService.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User ID missing" });

    try {
        const moods = await getMoods(userId);
        const sleep = await getSleepLogs(userId);

        // Take last 7 entries for current user
        const recentMoods = moods.slice(-7).map(m => `${m.mood} (${m.activities?.join(', ') || 'no activities'})`).join("; ");
        const recentSleep = sleep.slice(-7).map(s => `${s.hours}h (${s.quality})`).join("; ");

        const dataSummary = `Moods: ${recentMoods}. Sleep: ${recentSleep}.`;

        const insight = await generateInsight(dataSummary);
        res.json({ insight });
    } catch (error) {
        console.error("Insights Route Error:", error);
        res.status(500).json({ error: "Failed to generate insights" });
    }
});

export default router;
