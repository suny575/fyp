import express from "express";
import User from "../models/user.js";
const router = express.Router();
// =============================
// GET ALL TECHNICIANS
// =============================
router.get("/", async (req, res) => {
  try {
    const technicians = await User.find({ role: "technician" });
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =============================
// GET SINGLE TECHNICIAN BY ID
// =============================
router.get("/:id", async (req, res) => {
  try {
    const technician = await User.findOne({
      _id: req.params.id,
      role: "technician",
    });

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    res.json(technician);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// INVITE / CREATE TECHNICIAN
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newTechnician = new User({
      email,
      role: "technician",
    });

    await newTechnician.save();

    res.status(201).json(newTechnician);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE TECHNICIAN
router.delete("/:id", async (req, res) => {
  try {
    const technician = await User.findOneAndDelete({
      _id: req.params.id,
      role: "technician",
    });

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    res.json({ message: "Technician removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
