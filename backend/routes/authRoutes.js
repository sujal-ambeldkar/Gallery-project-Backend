// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================== Signup ==================
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashedPassword, role });

    res.json({ success: true, message: "User created", userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================== Login ==================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: { username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================== TEMP: Reset Admin ==================
// Call this once to set a new valid password for the admin,
// then REMOVE this route and redeploy.
router.post("/reset-admin", async (req, res) => {
  try {
    const email = "cow@gmail.com";   // admin email
    const newPassword = "123456";    // new 6+ character password

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const admin = await User.findOneAndUpdate(
      { email },
      {
        username: "cow",
        email,
        password: hashedPassword,
        role: "admin",
      },
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      message: "Admin reset/created",
      userId: admin._id,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    console.error("reset-admin error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
