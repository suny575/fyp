

// routes/allocationRoutes.js
import express from "express";
import {
  getPendingRequests,
  approveStockRequest,
  rejectStockRequest,
  getAllocationHistory
} from "../controllers/AllocationController.js";
import protect from "../middleware/authMiddleware.js"; // optional auth

const router = express.Router();

// ✅ Get all pending stock requests
router.get("/pending", protect, getPendingRequests);

// ✅ Approve a stock request
router.put("/approve/:id", protect, approveStockRequest);

// ✅ Reject a stock request
router.put("/reject/:id", protect, rejectStockRequest);

// ✅ Get allocation history (stock + equipment)
router.get("/history", protect, getAllocationHistory);

export default router;


