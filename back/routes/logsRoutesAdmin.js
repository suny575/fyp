// import express from "express";
// import { getSystemLogs, createSystemLog } from "../controllers/logControllerAdmin.js";

// const router = express.Router();

// // Get all system logs
// router.get("/", getSystemLogs);

// // Add a new system log
// router.post("/", createSystemLog);

// export default router;

import express from "express";
import { createLog, getLogs } from "../controllers/logControllerAdmin.js";

const router = express.Router();

// Fetch logs (for frontend table + filters)
router.get("/", getLogs);

// Optional: endpoint to manually create a log (can be used in events)
router.post("/create", async (req, res) => {
  try {
    const { event, type, severity, description, user } = req.body;
    const log = await createLog({ event, type, severity, description, user });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: "Error creating log" });
  }
});

export default router;