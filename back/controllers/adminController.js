
import UserAdmin from "../models/UserAdmin.js";
import crypto from "crypto";

// Invite manager
export const inviteManager = async (req, res) => {
  try {
    const { email } = req.body;

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

    // TODO: send email with link containing token

    res.status(201).json({ message: "Invitation created", manager: newManager });
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

    await manager.deleteOne();
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