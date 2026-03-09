

import Invitation from "../models/invitation.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Notification from "../models/AdminNotification.js";
import { createLog } from "../controllers/logControllerAdmin.js";
import User from "../models/user.js"; 

// ================= INVITE MANAGER =================
export const inviteManager = async (req, res) => {
  try {
    const { email, adminName } = req.body;

    // Check if invitation already exists
    const existingInvitation = await Invitation.findOne({ email });
    if (existingInvitation)
      return res.status(400).json({ message: "Manager already invited" });

    const token = crypto.randomBytes(32).toString("hex");

    const newInvitation = await Invitation.create({
      email,
      role: "maintenanceManager",
      token,
      used: false,
      status: "pending",
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // 🔔 CREATE SYSTEM NOTIFICATION
    await Notification.create({
      type: "System",
      message: `Manager ${newInvitation.email} has been invited.`,
      time: new Date().toLocaleString(),
    });

    // 🔥 CREATE LOG
    await createLog({
      event: "Admin invites manager",
      type: "Manager",
      severity: "Low",
      description: `Invitation sent to ${newInvitation.email}`,
      user: adminName || "Admin",
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
    const registerLink = `http://localhost:3000/auth?token=${token}`;

    // 🔥 SEND EMAIL
    await transporter.sendMail({
      from: `"Maintenance System" <${process.env.EMAIL_USER}>`,
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
      manager: newInvitation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE MANAGER INVITATION =================
// export const deleteManager = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const invitation = await Invitation.findById(id);
//     if (!invitation)
//       return res.status(404).json({ message: "Manager not found" });

//     const email = invitation.email;

//     await invitation.deleteOne();


    export const deleteManager = async (req, res) => {
  try {
    const { id } = req.params;

    // Try deleting from User first
    let user = await User.findById(id);
    if (user) {
      await user.deleteOne();
      return res.status(200).json({ message: "Manager deleted from users" });
    }

    // Otherwise delete from Invitation
    const invitation = await Invitation.findById(id);
    if (!invitation) return res.status(404).json({ message: "Manager not found" });

    await invitation.deleteOne();

 // 🔔 CREATE SYSTEM NOTIFICATION
    await Notification.create({
      type: "System",
      message: `Admin deleted manager invitation for ${email}`,
      time: new Date().toLocaleString(),
    });

    res.status(200).json({ message: "Manager deleted from invitations" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

   

//     res.status(200).json({ message: "Manager deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// ================= UPDATE MANAGER STATUS =================
// export const updateManagerStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const invitation = await Invitation.findById(id);
//     if (!invitation)
//       return res.status(404).json({ message: "Manager not found" });

//     invitation.status = status;
//     await invitation.save();

//     res.status(200).json({ message: "Status updated", manager: invitation });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const updateManagerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Manager not found or not registered" });

    user.status = status;
    await user.save();

    res.status(200).json({ message: "Status updated", manager: user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL MANAGERS =================


// export const getManagers = async (req, res) => {
//   try {
//     const invitations = await Invitation.find({ role: "maintenanceManager" });

//     const managers = await Promise.all(
//       invitations.map(async (inv) => {
//         const user = await User.findOne({ email: inv.email });

//         // If manager already registered → read from User model
//         if (inv.used && user) {
//           return {
//             _id: user._id,
//             email: user.email,
//             role: user.role,
//             status: user.status,
//             name: user.name,
//           };
//         }

//         // If not registered yet → read from Invitation
//         return {
//           _id: inv._id,
//           email: inv.email,
//           role: inv.role,
//           status: "pending",
//           name: "-",
//         };
//       })
//     );

//     res.status(200).json({ managers });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getManagers = async (req, res) => {
  try {
    // 1️⃣ Pending invitations (not registered)
    const invitations = await Invitation.find({ role: "maintenanceManager", used: false });

    // 2️⃣ Registered users
    const users = await User.find({ role: "maintenanceManager" });

    // Map invitations → pending managers
    const pendingManagers = invitations.map(inv => ({
      _id: inv._id,
      email: inv.email,
      role: inv.role,
      status: "pending",
      name: "-",
      type: "invitation", // optional to identify source
    }));

    // Map users → registered managers
    const activeManagers = users.map(user => ({
      _id: user._id,
      email: user.email,
      role: user.role,
      status: user.status, // active or inactive
      name: user.name,
      type: "user",
    }));

    const managers = [...pendingManagers, ...activeManagers];

    res.status(200).json({ managers });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};