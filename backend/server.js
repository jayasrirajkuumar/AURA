import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import moodRoutes from "./routes/mood.js";
import sleepRoutes from "./routes/sleep.js";
import insightRoutes from "./routes/insights.js";
import { initDB } from "./db/db.js";

dotenv.config();

// Initialize Database
initDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/insights", insightRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
