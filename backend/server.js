require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/db");
const authRoutes = require("./Routes/authRoutes");


const userRoutes = require("./Routes/userRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const app = express();
app.use(cors());
app.use(express.json());



// Connect to MongoDB
connectDB();

//Routes
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
    res.send("Chat API is running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
