
import express from "express";
import {
  inviteManager,
  deleteManager,
  updateManagerStatus,
  getManagers,
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

// Routes
router.post("/invite-manager", inviteManager);
router.delete("/manager/:id", deleteManager);
router.patch("/manager/:id/status", updateManagerStatus);
router.get("/managers", getManagers);

export default router;
