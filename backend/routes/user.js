import express from "express";
import { getUsers, addUser, updateUser } from "../db/db.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
    try {
        const users = await getUsers();
        const { email } = req.body;

        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = await addUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const users = await getUsers();
        const { email, password } = req.body;

        const user = users.find(u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});

// Update Profile
router.put("/profile/:id", async (req, res) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
});

export default router;
