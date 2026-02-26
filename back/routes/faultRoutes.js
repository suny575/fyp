import express from "express";
import Fault from "../models/fault.js";

const router = express.Router();

/**
 * GET all faults
 * (For overview + dashboard)
 */
router.get("/", async (req, res) => {
  try {
    const faults = await Fault.find()
      .populate("equipment", "name") // only get equipment name
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(faults);
  } catch (err) {
    console.error("Error fetching faults:", err);
    res.status(500).json({ message: "Server error fetching faults" });
  }
});

export default router;
