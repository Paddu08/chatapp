const express = require("express");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Send a message (Protected)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { sender, receiver, text } = req.body;

        if (!sender || !receiver || !text) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const message = new Message({ sender, receiver, text });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ Get all messages between two users (Protected)
router.get("/:sender/:receiver", authMiddleware, async (req, res) => {
    try {
        const { sender, receiver } = req.params;

        const messages = await Message.find({ 
            $or: [
                { sender: req.params.sender, receiver: req.params.receiver },
                { sender: req.params.receiver, receiver: req.params.sender }
            ]
        }).sort({ createdAt: 1 })
        .populate("sender", "name")
        .populate("receiver", "name");

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Delete a message by ID (Protected)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
