import express from "express";
import User from "../models/user.js";
import Invitation from "../models/invitation.js";
import protect from "../middleware/authMiddleware.js";
import { withHospitalScope } from "../utils/hospitalScope.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const search = req.query.search || "";
    const roleFilter = req.query.role || "";

    const roles = roleFilter
      ? [roleFilter]
      : ["technician", "pharmacyStore", "depStaff"];

    let combined = [];

    for (const role of roles) {
      const users = await User.find(
        withHospitalScope({ role }, req.user.hospital),
      ).lean();

      const activeOrInactive = users.map((user) => ({
        id: user._id.toString(),
        name: user.name || "Registered User",
        email: user.email,
        hospital: user.hospital,
        role: user.role,
        status: user.status || "active",
      }));

      const invitations = await Invitation.find(
        withHospitalScope(
          {
            role,
            used: false,
            expiresAt: { $gt: new Date() },
          },
          req.user.hospital,
        ),
      ).lean();

      const pending = invitations.map((invite) => ({
        id: invite._id.toString(),
        name: "Pending Registration",
        email: invite.email,
        hospital: invite.hospital,
        role: invite.role,
        status: "pending",
      }));

      let merged = [...activeOrInactive, ...pending];

      if (!showAll) {
        const activeUsers = merged
          .filter((user) => user.status === "active")
          .slice(0, 3);
        const pendingUsers = merged
          .filter((user) => user.status === "pending")
          .slice(0, 3);
        const inactiveUsers = merged.filter((user) => user.status === "inactive");
        merged = [...activeUsers, ...pendingUsers, ...inactiveUsers];
      }

      combined = [...combined, ...merged];
    }

    if (search.length >= 2) {
      const lowerSearch = search.toLowerCase();
      combined = combined.filter((user) =>
        user.name.toLowerCase().includes(lowerSearch),
      );
    }

    res.json(combined);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const user = await User.findOne(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    );

    if (user) {
      await user.deleteOne();
    } else {
      const invite = await Invitation.findOne(
        withHospitalScope({ _id: req.params.id }, req.user.hospital),
      );
      if (invite) {
        await invite.deleteOne();
      } else {
        return res.status(404).json({ message: "User or invite not found" });
      }
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findOneAndUpdate(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
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
