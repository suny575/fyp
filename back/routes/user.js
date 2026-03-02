import express from "express";
import User from "../models/user.js";
import Invitation from "../models/invitation.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ==============================
// GET USERS (ShowAll OR limited)
// ==============================
router.get("/", protect, async (req, res) => {
  try {
    const showAll = req.query.all === "true"; // boolean from frontend
    const search = req.query.search || "";
    const roleFilter = req.query.role || "";

    const roles = roleFilter
      ? [roleFilter]
      : ["technician", "pharmacyStore", "depStaff"];
    let combined = [];

    for (let role of roles) {
      // Fetch all users for this role
      const users = await User.find({ role }).lean();
      const activeOrInactive = users.map((u) => ({
        id: u._id.toString(),
        name: u.name || "Registered User",
        email: u.email,
        role: u.role,
        status: u.status || "active",
      }));

      // Fetch all pending invitations for this role
      const invitations = await Invitation.find({
        role,
        used: false,
        expiresAt: { $gt: new Date() },
      }).lean();

      const pending = invitations.map((i) => ({
        id: i._id.toString(),
        name: "Pending Registration",
        email: i.email,
        role: i.role,
        status: "pending",
      }));

      let merged = [...activeOrInactive, ...pending];

      // Only slice if showAll is false
      if (!showAll) {
        const activeUsers = merged
          .filter((u) => u.status === "active")
          .slice(0, 3);
        const pendingUsers = merged
          .filter((u) => u.status === "pending")
          .slice(0, 3);
        const inactiveUsers = merged.filter((u) => u.status === "inactive");
        merged = [...activeUsers, ...pendingUsers, ...inactiveUsers];
      }

      combined = [...combined, ...merged];
    }

    // Apply search filter
    if (search.length >= 2) {
      const lowerSearch = search.toLowerCase();
      combined = combined.filter((u) =>
        u.name.toLowerCase().includes(lowerSearch),
      );
    }

    res.json(combined);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// DELETE USER OR PENDING INVITE
// ==============================
router.delete("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
    } else {
      const invite = await Invitation.findById(req.params.id);
      if (invite) await invite.deleteOne();
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

// ==============================
// ACTIVATE / DEACTIVATE USER
// ==============================
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ staff: { id: user._id.toString(), status: user.status } });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ message: "Error updating status" });
  }
});

export default router;
