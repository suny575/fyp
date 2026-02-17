const express = require("express");
const router = express.Router();
const MaintenanceLog = require("../models/MaintenanceLog");

// Create log
router.post("/", async (req, res) => {
  try {
    const log = new MaintenanceLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all logs
router.get("/", async (req, res) => {
  try {
    const logs = await MaintenanceLog.find().populate("equipment performedBy", "name");
    res.json(logs);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
