
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

// 🔹 REGISTER a new user
router.post(
    "/register",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: "User already exists" });
            }

            

            // Create user
            user = new User({ name, email, password });
            await user.save();

            // Generate JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            res.json({ token, userId: user._id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

// 🔹 LOGIN user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ message: "User not found" });
        }

        console.log("✅ User found:", user.email);
        console.log("Entered password:", password);
        console.log("Hashed password in DB:", user.password);


        if (!(await user.matchPassword(password))) {
            console.log("❌ Password does not match!");
            return res.status(400).json({ message: "Invalid credentials" });
        }



        

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, userId: user._id });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/me", authMiddleware,async (req, res) => {
    try {
        console.log("req.user:", req.user); // Debugging log

        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, token missing or invalid" });
        }

        const user = await User.findById(req.user.userId).select("-password");
        res.json(user);
    } catch (error) {
        console.error("Error in /me route:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
