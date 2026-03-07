import express from "express";
import {
  getAdminSettings,
  updateAdminSettings
} from "../controllers/adminSettingsController.js";

const router = express.Router();

router.get("/", getAdminSettings);
router.put("/", updateAdminSettings);

export default router;