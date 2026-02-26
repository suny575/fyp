import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Invitation from "../models/Invitation.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, password, token } = req.body;

    if (!name || !password || !token) {
      return res.status(400).json({
        message: "Name, password and token are required",
      });
    }

    const invitation = await Invitation.findOne({ token });
    if (!invitation) {
      return res.status(400).json({
        message: "Invalid or expired invitation token",
      });
    }

    const existingUser = await User.findOne({ email: invitation.email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: invitation.email,
      role: invitation.role,
      password: hashedPassword,
      status: "active",
      approved: true,
    });

    // update invitation instead of deleting
    invitation.status = "accepted";
    await invitation.save();

    // 🔥 Emit live update
    req.app.get("io").emit("technicianRegistered", {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      status: "active",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      message: "Server error during registration",
    });
  }
});

export default router;
