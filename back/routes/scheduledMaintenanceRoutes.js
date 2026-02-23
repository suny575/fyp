const express = require("express");
const router = express.Router();
const ScheduledMaintenance = require("../models/ScheduledMaintenance");

router.get("/", async (req, res) => {
  try {
    const data = await ScheduledMaintenance.find()
      .populate("equipment")
      .sort({ nextDate: 1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;