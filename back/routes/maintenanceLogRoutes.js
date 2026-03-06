import express from "express";
import {
  getLogs,
  createLog,
  getLogById,
} from "../controllers/maintenanceLogController.js";

const router = express.Router();

// Get all logs
router.get("/", getLogs);

// Create a maintenance log
router.post("/", createLog);

// Get single log
router.get("/:id", getLogById);

export default router;
