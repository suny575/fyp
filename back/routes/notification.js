import express from "express";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notificationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get logged-in user's notifications
router.get("/", protect, getNotifications);

// Mark notification as read
router.patch("/:id/read", protect, markNotificationRead);
//delete sindle notification
router.delete("/:id", protect, deleteNotification);
//clear all notification
router.delete("/", protect, clearAllNotifications);

export default router;
