import express from "express";
import {
  getUpcomingSchedules,
  createSchedule,
  getScheduleById,
} from "../controllers/maintenanceScheduleController.js";

const router = express.Router();

// Fetch all upcoming schedules
router.get("/upcoming", getUpcomingSchedules);

// Create new maintenance schedule
router.post("/", createSchedule);

// Get single schedule by id
router.get("/:id", getScheduleById);

export default router;
