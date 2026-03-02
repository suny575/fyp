import express from "express";
import protect from "../middleware/authMiddleware.js";
import { submitFault, getFaults } from "../controllers/faultController.js";
import upload from "../services/uploadConfig.js";

const router = express.Router();
// GET all faults
router.get("/", protect, getFaults);

// POST fault with optional images/audio
router.post(
  "/",
  protect,
  upload.fields([
    { name: "images", maxCount: 5 }, // max 5 images
    { name: "voiceNote", maxCount: 1 }, // only 1 voice note
  ]),
  submitFault,
);

export default router;
