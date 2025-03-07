const express = require("express");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

// ✅ Send a message
router.post("/", async (req, res) => {
    try {
        const { sender, receiver, text } = req.body;
        const message = new Message({ sender, receiver, text });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ Get all messages between two users
router.get("/:sender/:receiver", async (req, res) => {
    try {
        const { sender, receiver } = req.params;
        const messages = await Message.find({ 
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Delete a message by ID
router.delete("/:id", async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
