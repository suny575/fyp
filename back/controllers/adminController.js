
import Invitation from "../models/invitation.js";
import User from "../models/user.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Notification from "../models/AdminNotification.js";
import { createLog } from "../controllers/logControllerAdmin.js";
// import User from "../models/user.js";
import { resolveHospitalName } from "../utils/hospitalScope.js";

const requireAdmin = (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return false;
  }

  return true;
};

export const inviteManager = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const { email, adminName, hospital } = req.body;

    const existingInvitation = await Invitation.findOne({ email });
    if (existingInvitation) {
      return res.status(400).json({ message: "Manager already invited" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const managerHospital = resolveHospitalName(hospital, req.user?.hospital);

    const newInvitation = await Invitation.create({
      email,
      role: "maintenanceManager",
      hospital: managerHospital,
      token,
      used: false,
      status: "pending",
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    // 🔔 System Notification
    await Notification.create({
      type: "System",
      message: `Manager ${newInvitation.email} has been invited for ${managerHospital}.`,
      time: new Date().toLocaleString(),
    });

    // 🔥 Log
    await createLog({
      event: "Admin invites manager",
      type: "Manager",
      severity: "Low",
      description: `Invitation sent to ${newInvitation.email} for ${managerHospital}`,
      user: adminName || req.user.name || "Admin",
    });

    // 🔥 Email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const registerLink = `http://localhost:3000/auth?token=${token}`;

    await transporter.sendMail({
      from: `"Maintenance System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Manager Invitation",
      html: `
        <h3>You have been invited as a Manager</h3>
        <p>Hospital: <strong>${managerHospital}</strong></p>
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

// ================= REGISTER MANAGER (after invitation) =================
export const registerManager = async (req, res) => {
  try {
    const { token, name, password } = req.body;

    const invitation = await Invitation.findOne({ token });
    if (!invitation) return res.status(400).json({ message: "Invalid token" });
    if (invitation.used) return res.status(400).json({ message: "Already registered" });

    // Create User with status active
    const newUser = await User.create({
      name,
      email: invitation.email,
      password,
      role: invitation.role,
      status: "active",
    });

    // Mark invitation as used and active
    invitation.used = true;
    invitation.status = "active";
    await invitation.save();

    res.status(201).json({ message: "Manager registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE MANAGER =================

export const deleteManager = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;

    // Find manager in User collection
    const user = await User.findById(id);

    if (user) {
      const email = user.email;

      // delete user
      await User.findByIdAndDelete(id);

      // delete related invitation
      await Invitation.findOneAndDelete({ email });

      return res.status(200).json({
        message: "Manager and invitation deleted successfully",
      });
    }

    const invitation = await Invitation.findById(id);
    if (!invitation) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const email = invitation.email;
    await invitation.deleteOne();

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


// ================= UPDATE MANAGER STATUS =================
export const updateManagerStatus = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Manager not found or not registered" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: "Status updated", manager: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getManagers = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const invitations = await Invitation.find({
      role: "maintenanceManager",
      used: false,
    });

    const users = await User.find({ role: "maintenanceManager" });

    const pendingManagers = invitations.map((inv) => ({
      _id: inv._id,
      email: inv.email,
      hospital: resolveHospitalName(inv.hospital),
      role: inv.role,
      status: "pending",
      name: "-",
      type: "invitation",
    }));

    const activeManagers = users.map((user) => ({
      _id: user._id,
      email: user.email,
      hospital: resolveHospitalName(user.hospital),
      role: user.role,
      status: user.status,
      name: user.name,
      type: "user",
    }));

    res.status(200).json({ managers: [...pendingManagers, ...activeManagers] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
