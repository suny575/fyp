
import express from "express";
import {
  inviteManager,
  deleteManager,
  updateManagerStatus,
  getManagers,
} from "../controllers/adminController.js";

const router = express.Router();

// Routes
router.post("/invite-manager", inviteManager);
router.delete("/manager/:id", deleteManager);
router.patch("/manager/:id/status", updateManagerStatus);
router.get("/managers", getManagers);

export default router;