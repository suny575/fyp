const express = require("express");
const router = express.Router();
const Equipment = require("../models/equipment");

// Create equipment
router.post("/", async (req, res) => {
  try {
    const equipment = new Equipment(req.body);
    await equipment.save();
    res.status(201).json(equipment);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get all equipment
router.get("/", async (req, res) => {
  try {
    const equipments = await Equipment.find();
    res.json(equipments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get by ID
router.get("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ msg: "Equipment not found" });
    res.json(equipment);
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ msg: "Invalid ID" });
    res.status(500).json({ msg: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!equipment) return res.status(404).json({ msg: "Equipment not found" });
    res.json(equipment);
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ msg: "Invalid ID" });
    res.status(500).json({ msg: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) return res.status(404).json({ msg: "Equipment not found" });
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ msg: "Invalid ID" });
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
