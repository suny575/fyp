import express from "express";
const router = express.Router();
import getDashboardSummary from "../controllers/managerController.js";

router.get("/dashboard-summary", getDashboardSummary);

module.exports = router;
