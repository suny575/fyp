import express from "express";
import User from "../models/User.js";
import Invitation from "../models/invitation.js";
const router = express.Router();

// GET ALL PHARMACY STORES
router.get("/", async (req, res) => {
  try {
    const registered = await User.find({ role: "pharmacyStore" }).lean();
    const activeStores = registered.map((s) => ({
      _id: s._id,
      name: s.name || "Registered Store",
      email: s.email,
      role: s.role,
      status: "active",
    }));

    const pendingInvites = await Invitation.find({
      role: "pharmacyStore",
      status: "pending",
    }).lean();

    const pendingStores = pendingInvites.map((invite) => ({
      _id: invite._id,
      name: "Pending Registration",
      email: invite.email,
      role: invite.role,
      status: "pending",
    }));

    res.json([...activeStores, ...pendingStores]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE STORE
router.delete("/:id", async (req, res) => {
  try {
    const store = await User.findOneAndDelete({
      _id: req.params.id,
      role: "pharmacystore",
    });

    if (!store)
      return res.status(404).json({ message: "Pharmacy Store not found" });

    res.json({ message: "Store removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
