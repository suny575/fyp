// routes/register.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Invitation from "../models/Invitation.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

/**
 * POST /register
 * User registers via invitation
 * Body: { name, password, token }
 */
router.post("/", async (req, res) => {
  try {
    const { name, password, token } = req.body;

    if (!name || !password || !token) {
      return res
        .status(400)
        .json({ message: "Name, password and token are required" });
    }

    // Find invitation
    const invitation = await Invitation.findOne({ token });
    if (!invitation) {
      return res
        .status(400)
        .json({ message: "Invalid or expired invitation token" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: invitation.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email: invitation.email,
      role: invitation.role,
      password: hashedPassword,
      approved: true,
    });

    // Delete invitation
    await Invitation.deleteOne({ _id: invitation._id });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

export default router;
