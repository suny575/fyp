import express from "express";
import { loginUser, getMe, adminResetPassword } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// auth/login
router.post("/", loginUser);
router.post("/admin-reset-password", adminResetPassword);

// auth/me
router.get("/me", protect, getMe);

export default router;
