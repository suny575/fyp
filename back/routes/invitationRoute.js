
import express from "express";
import crypto from "crypto";
import Invitation from "../models/invitation.js";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================
// 1️⃣ Send Invitation
// =====================
router.post("/", protect, async (req, res) => {
  try {
    const { email, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const existingInvite = await Invitation.findOne({ email, used: false });
    if (existingInvite)
      return res.status(400).json({ message: "Invitation already sent" });

    const token = crypto.randomBytes(32).toString("hex");

    const invitation = await Invitation.create({ email, role, token, used: false });

    const inviteLink = `http://localhost:3000/auth?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "You are invited to join the system",
      html: `
        <h3>You have been invited as ${role}</h3>
        <p>Click below to register:</p>
        <a href="${inviteLink}">${inviteLink}</a>
      `,
    });

    res.status(201).json({ message: "Invitation sent successfully", invitation });
  } catch (err) {
    console.error("Error sending invitation:", err);
    res.status(500).json({ message: "Server error sending invitation" });
  }
});

// =====================
// 2️⃣ Verify Invitation Token
// =====================
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findOne({ token });

    if (!invitation)
      return res.status(404).json({ message: "Invalid or expired invitation token" });

    if (invitation.used)
      return res.status(400).json({ message: "Invitation already used" });

    res.json({ email: invitation.email, role: invitation.role, token: invitation.token });
  } catch (err) {
    console.error("Error verifying invitation:", err);
    res.status(500).json({ message: "Server error verifying invitation" });
  }
});





// =====================
// 4️⃣ Get Invitations by Role
// =====================
router.get("/", protect, async (req, res) => {
  try {
    const { role } = req.query;

    if (!role) return res.status(400).json({ message: "Role query is required" });

    const invitations = await Invitation.find({ role, used: false });

    res.json(invitations);
  } catch (err) {
    console.error("Error fetching invitations:", err);
    res.status(500).json({ message: "Server error fetching invitations" });
  }
});









// =====================
// 3️⃣ Mark as Used (after successful registration)
// =====================
router.put("/use/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await Invitation.findOne({ token });

    if (!invitation)
      return res.status(404).json({ message: "Invitation not found" });

    invitation.used = true;
    await invitation.save();

    res.json({ message: "Invitation marked as used" });
  } catch (err) {
    console.error("Error marking invitation as used:", err);
    res.status(500).json({ message: "Server error updating invitation" });
  }
});

export default router;