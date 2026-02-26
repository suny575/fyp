import express from "express";
const router = express.Router();
import getDashboardSummary from "../controllers/managerController";

router.get("/dashboard-summary", getDashboardSummary);

module.exports = router;
