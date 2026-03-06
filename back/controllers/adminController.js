
import UserAdmin from "../models/UserAdmin.js";
import crypto from "crypto";
import nodemailer from "nodemailer"; 
import Notification from "../models/AdminNotification.js"; 
import { createLog } from "../controllers/logControllerAdmin.js";

// Invite manager
export const inviteManager = async (req, res) => {
  try {
    const { email ,adminName } = req.body;

    const existingUser = await UserAdmin.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Manager already invited" });

    const token = crypto.randomBytes(32).toString("hex");

    const newManager = await UserAdmin.create({
      email,
      role: "manager",
      status: "pending",
      invitationToken: token,
      invitationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24h
    });

    // 🔔 CREATE SYSTEM NOTIFICATION
await Notification.create({
  type: "System",
  message: `Manager ${newManager.email} has been invited.`,
  time: new Date().toLocaleString(),
});

    // 🔥 CREATE LOG
await createLog({
  event: "Admin invites manager",
  type: "Manager",
  severity: "Low",
  description: `Invitation sent to ${newManager.email}`,
  user: adminName || "Admin" // or req.user.name if you have authentication
});


    // 🔥 CREATE EMAIL TRANSPORTER

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,     
  port: process.env.EMAIL_PORT,     
  secure: false,                     
  auth: {
    user: process.env.EMAIL_USER,   
    pass: process.env.EMAIL_PASS,   
  },
});


// 🔥 CREATE REGISTRATION LINK
const registerLink = `http://localhost:3000/register?token=${token}`;

// 🔥 SEND EMAIL
await transporter.sendMail({
  from: `"Pharmacy System" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Manager Invitation",
  html: `
    <h3>You have been invited as a Manager</h3>
    <p>Click the link below to register:</p>
    <a href="${registerLink}">${registerLink}</a>
  `,
});
    res.status(201).json({
  message: "Invitation created and email sent",
  manager: newManager,
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete manager
export const deleteManager = async (req, res) => {
  try {
    const { id } = req.params;
    const manager = await UserAdmin.findById(id);
    if (!manager) return res.status(404).json({ message: "Manager not found" });

     const email = manager.email; // save email before deletion

    await manager.deleteOne();


    // 🔔 CREATE SYSTEM NOTIFICATION
    await Notification.create({
      type: "System",
      message: `Admin deleted manager invitation for ${email}`,
      time: new Date().toLocaleString(),
    });

    res.status(200).json({ message: "Manager deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update status
export const updateManagerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const manager = await UserAdmin.findById(id);
    if (!manager) return res.status(404).json({ message: "Manager not found" });

    manager.status = status;
    await manager.save();

    res.status(200).json({ message: "Status updated", manager });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all managers
export const getManagers = async (req, res) => {
  try {
    const managers = await UserAdmin.find({ role: "manager" });
    res.status(200).json({ managers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};