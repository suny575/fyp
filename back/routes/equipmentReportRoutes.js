import express from "express";
import EquipmentReport from "../models/EquipmentReport.js";
import Equipment from "../models/Equipment.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new report
router.post("/", protect, async (req, res) => {
  const { equipment, description } = req.body;

  if (!equipment || !description)
    return res
      .status(400)
      .json({ message: "Equipment and description required" });

  try {
    const report = await EquipmentReport.create({
      equipment,
      description,
      reportedBy: req.user._id,
    });
    res.status(201).json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all reports for technician (or manager view)
router.get("/", protect, async (req, res) => {
  try {
    const reports = await EquipmentReport.find()
      .populate("equipment", "name _id")
      .populate("reportedBy", "name email");
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Search equipment for live search in report form
router.get("/searchEquipment", protect, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const regex = new RegExp(q, "i");
    const equipment = await Equipment.find({ name: regex }).limit(10);
    res.json(equipment);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
