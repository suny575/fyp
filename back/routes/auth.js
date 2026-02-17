const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Invitation = require("../models/Invitation"); // manager already added email + role
require("dotenv").config();

// ----------------------
// Register (user fills name + password, email + role from manager)
// ----------------------
router.post("/register", async (req, res) => {
  try {
    const { name, password, email } = req.body; // user provides name + password

    // Fetch email + role from manager's pre-added entry
    const invitation = await Invitation.findOne({ email });
    if (!invitation)
      return res.status(400).json({ msg: "No pre-set email/role found" });

    // Check if user already registered
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already registered" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with manager-set email + role
    const user = new User({
      name,
      email: invitation.email,
      role: invitation.role,
      password: hashedPassword,
    });

    await user.save();

    // Optionally, delete invitation if you want one-time use
    await Invitation.findByIdAndDelete(invitation._id);

    res.status(201).json({ msg: "User registered successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ----------------------
// Login (email + password)
// ----------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ msg: "Login successful", token, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
