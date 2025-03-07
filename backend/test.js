const bcrypt = require("bcryptjs");

const testPassword = "123456"; // The password you enter in login

async function test() {
    // Hash the password (simulate registration)
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    console.log("🔹 Hashed Password:", hashedPassword);

    // Compare with correct password
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    console.log("✅ Password match result:", isMatch);
}

test();
