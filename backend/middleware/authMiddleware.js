const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    console.log("Request Headers:", req.headers); // 🟢 Log all request headers

    const token = req.header("Authorization");
    console.log("Raw Token:", token); // 🟢 Log raw token received

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        // Extract actual token (remove "Bearer ")
        const extractedToken = token.replace("Bearer ", "").trim();
        console.log("Extracted Token:", extractedToken); // 🟢 Log extracted token

        // Verify token
        const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // 🟢 Log decoded payload

        req.user = decoded; // ✅ Attach user data
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;    