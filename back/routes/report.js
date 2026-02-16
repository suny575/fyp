const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// Create report
router.post("/", async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
