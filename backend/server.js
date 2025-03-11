require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/db");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const authRoutes = require("./Routes/authRoutes");
const userRoutes = require("./Routes/userRoutes");
const messageRoutes = require("./Routes/messageRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app); // Single server for both HTTP & WebSocket
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const users = {}; // Track users

io.on("connection", (socket) => {
    const userId = socket.handshake.auth?.userId;

    if (!userId) {
        console.log("❌ No userId received! Disconnecting...");
        socket.disconnect();
        return;
    }

    // ✅ Join a personal room based on userId
    socket.join(userId);
    console.log(`✅ User joined room: ${userId}`);

    // 🔹 Private messaging using rooms
    socket.on("privateMessage", ({ recipientId, message }) => {
        io.to(recipientId).emit("receiveMessage", { senderId: userId, message });
        console.log(`📩 Message from ${userId} to ${recipientId}: ${message}`);
    });

    // 🔹 Handle disconnect
    socket.on("disconnect", () => {
        console.log(`❌ User ${userId} disconnected`);
    });
});

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
    res.send("Chat API is running...");
});

// Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
