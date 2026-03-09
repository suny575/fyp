import express from "express";
import {
  getUpcomingSchedules,
  createSchedule,
  getScheduleById,
} from "../controllers/maintenanceScheduleController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Fetch all upcoming schedules
router.get("/upcoming", protect, getUpcomingSchedules);

// Create new maintenance schedule
router.post("/", protect, createSchedule);

// Get single schedule by id
router.get("/:id", protect, getScheduleById);

export default router;
