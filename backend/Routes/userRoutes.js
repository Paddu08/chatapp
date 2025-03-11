const express = require("express");

const User = require("../models/User");

const router = express.Router();

// ✅ Create a new user (Signup)
router.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ Get all users
router.get("/", async (req, res) => {
    try {
        console.log("🔍 Fetching users..."); // ✅ Debugging log

        const users = await User.find().select("-password");
        console.log("👥 Users found:", users);

        if (!users.length) {
            return res.status(404).json({ message: "No users found" });
        }

        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// ✅ Update user by ID
router.put("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ Delete user by ID
router.delete("/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
