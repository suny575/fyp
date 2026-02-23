import express from "express";
import crypto from "crypto";
import Invitation from "../models/Invitation.js";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js"; // correct import
import nodemailer from "nodemailer";

const router = express.Router();

// POST /api/invitations
router.post("/", protect, async (req, res) => {
  try {
    const { email, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const existingInvite = await Invitation.findOne({ email });
    if (existingInvite)
      return res.status(400).json({ message: "Invitation already sent" });

    const token = crypto.randomBytes(32).toString("hex");

    await Invitation.create({ email, role, token });

    // OPTIONAL: send email here
    // sendInviteEmail(email, token);

    res.status(201).json({ message: "Invitation sent successfully", token });
  } catch (err) {
    console.error("Error in invite:", err);
    res.status(500).json({ message: "Server error sending invitation" });
  }
});

export default router;
