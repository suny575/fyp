import express from "express";
import MaintenanceLog from "../models/maintenanceLog.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const log = new MaintenanceLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const logs = await MaintenanceLog.find().populate(
      "equipment performedBy",
      "name",
    );
    res.json(logs);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

export default router;
