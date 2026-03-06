import express from "express";
import { loginUser, getMe } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// auth/login
router.post("/", loginUser);

// auth/me
router.get("/me", protect, getMe);

export default router;
