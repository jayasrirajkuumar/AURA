import express from "express";
import { addSleepLog, getSleepLogs } from "../db/db.js";

const router = express.Router();

// GET sleep history
router.get("/history", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User ID missing" });

    try {
        const history = await getSleepLogs(userId);
        res.json(history);
    } catch (error) {
        console.error("Sleep History Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch sleep history" });
    }
});

// POST new sleep log
router.post("/", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User ID missing" });

    const { hours, quality } = req.body;

    if (hours === undefined || !quality) {
        return res.status(400).json({ error: "Hours and quality are required" });
    }

    try {
        await addSleepLog(userId, { hours, quality });
        res.json({ success: true, message: "Sleep logged successfully" });
    } catch (error) {
        console.error("Sleep Log Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
