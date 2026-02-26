import express from "express";
import User from "../models/User.js";
import Invitation from "../models/invitation.js";

const router = express.Router();

// =============================
// GET ALL DEP STAFF (REGISTERED + PENDING)
// =============================
router.get("/", async (req, res) => {
  try {
    // 1️⃣ Registered depStaff
    const registered = await User.find({ role: "depStaff" }).lean();
    const activeStaff = registered.map((staff) => ({
      id: staff._id,
      name: staff.name || "Registered Staff",
      email: staff.email,
      role: staff.role,
      status: "active",
    }));

    // 2️⃣ Pending invitations
    const pendingInvites = await Invitation.find({
      role: "depStaff",
      status: "pending", // match technician pattern
    }).lean();

    const pendingStaff = pendingInvites.map((invite) => ({
      id: invite._id,
      name: "Pending Registration",
      email: invite.email,
      role: invite.role,
      status: "pending",
    }));

    // 3️⃣ Merge both
    const allStaff = [...activeStaff, ...pendingStaff];

    console.log("ALL DEP STAFF:", allStaff); // debug log
    res.json(allStaff);
  } catch (err) {
    console.error("DepStaff fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================
// GET SINGLE DEP STAFF BY ID
// =============================
router.get("/:id", async (req, res) => {
  try {
    const staff = await User.findOne({
      _id: req.params.id,
      role: "depStaff",
    });

    if (!staff) return res.status(404).json({ message: "DepStaff not found" });

    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =============================
// INVITE / CREATE DEP STAFF
// =============================
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // check if already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newInvite = new Invitation({
      email,
      role: "depStaff",
      status: "pending",
    });

    await newInvite.save();
    res.status(201).json(newInvite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =============================
// DELETE DEP STAFF
// =============================
router.delete("/:id", async (req, res) => {
  try {
    const staff = await User.findOneAndDelete({
      _id: req.params.id,
      role: "depStaff",
    });

    if (!staff) return res.status(404).json({ message: "DepStaff not found" });

    res.json({ message: "DepStaff removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
