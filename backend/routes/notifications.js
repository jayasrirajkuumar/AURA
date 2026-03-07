import express from "express";
import { getNotifications, markNotificationAsRead, clearAllNotifications } from "../db/db.js";

const router = express.Router();

// GET all notifications for a user
router.get("/", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User ID missing" });

    try {
        const notifications = await getNotifications(userId);
        res.json(notifications);
    } catch (error) {
        console.error("Notifications Fetch Error:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

// PUT mark notification as read
router.put("/:id/read", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const { id } = req.params;
    if (!userId) return res.status(401).json({ error: "User ID missing" });

    try {
        const success = await markNotificationAsRead(userId, id);
        if (success) {
            res.json({ message: "Notification marked as read" });
        } else {
            res.status(404).json({ error: "Notification not found" });
        }
    } catch (error) {
        console.error("Notification Update Error:", error);
        res.status(500).json({ error: "Failed to update notification" });
    }
});

// DELETE all notifications
router.delete("/", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User ID missing" });

    try {
        await clearAllNotifications(userId);
        res.json({ message: "All notifications cleared" });
    } catch (error) {
        console.error("Notifications Clear Error:", error);
        res.status(500).json({ error: "Failed to clear notifications" });
    }
});

export default router;
