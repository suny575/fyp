import express from "express";
import { getPharmacyDashboard } from "../controllers/pharmacyDashboardController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, getPharmacyDashboard);

export default router;
