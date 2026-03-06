import express from "express";
import crypto from "crypto";
import Invitation from "../models/invitation.js";
import User from "../models/user.js";
import protect from "../middleware/authMiddleware.js";
import nodemailer from "nodemailer";

const router = express.Router();
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // smtp.gmail.com
  port: Number(process.env.EMAIL_PORT), // 587
  secure: false, // false for STARTTLS (587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter
  .verify()
  .then(() => console.log("SMTP ready ✅"))
  .catch((err) => console.error("SMTP verification failed:", err));

// =====================
// 1️⃣ Send Invitation
// =====================
router.post("/", protect, async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !role)
      return res.status(400).json({ message: "Email and role required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const existingInvite = await Invitation.findOne({
      email,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    if (existingInvite)
      return res.status(400).json({ message: "Active invitation exists" });

    const token = crypto.randomBytes(32).toString("hex");

    const invitation = await Invitation.create({
      email,
      role,
      token,
      used: false,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24h
    });

    const inviteLink = `${process.env.FRONTEND_URL}/auth?token=${token}`;

    // send email asynchronously
    transporter
      .sendMail({
        from: `"maintenanceManager" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "You are invited to join the system",
        html: `
        <h3>You have been invited as ${role}</h3>
        <p>Click below to register:</p>
        <a href="${inviteLink}">${inviteLink}</a>
      `,
      })
      .then(() => console.log(`Invitation email sent to ${email}`))
      .catch((err) => console.error(`Failed to send email to ${email}:`, err));

    res
      .status(201)
      .json({ message: "Invitation created and email sending..." });
  } catch (err) {
    console.error("Invitation error:", err);
    res.status(500).json({ message: "Failed to create invitation" });
  }
});

//verify token with expiration
router.get("/verify/:token", async (req, res) => {
  try {
    const invitation = await Invitation.findOne({
      token: req.params.token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!invitation)
      return res.status(400).json({ message: "Invalid or expired token" });

    res.json({
      email: invitation.email,
      role: invitation.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error verifying invitation" });
  }
});
export default router;
