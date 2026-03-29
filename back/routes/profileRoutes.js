import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../services/uploadConfig.js";
import { updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.put("/", protect, upload.single("profileImage"), updateProfile);

export default router;
