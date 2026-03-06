import express from "express";
import { registerUser } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();
// auth/register
router.post("/", registerUser);

export default router;
