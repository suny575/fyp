// import express from "express";
// import protect from "../middleware/authMiddleware.js";
// import {
//   createStockRequest,
//   getAllStockRequests
// } from "../controllers/StockRequestController.js";

// const router = express.Router();

// router.post("/", protect, createStockRequest);
// router.get("/", protect, getAllStockRequests);

// export default router;

import express from "express";
import {
  createStockRequest,
  getAllStockRequests,
  getStockRequestById,
  updateStockRequest,
  deleteStockRequest
} from "../controllers/StockRequestController.js";

import protect from "../middleware/authMiddleware.js"; // auth middleware

const router = express.Router();

// All routes require login
router.post("/", protect, createStockRequest);
router.get("/", protect, getAllStockRequests);
router.get("/:id", protect, getStockRequestById);
router.put("/:id", protect, updateStockRequest); // approve/reject
router.delete("/:id", protect, deleteStockRequest);

export default router;

