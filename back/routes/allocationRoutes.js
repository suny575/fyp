// import express from "express";
// import {
//   approveStockRequest,
//   rejectStockRequest,
//   getAllAllocations,
// } from "../controllers/AllocationController.js";
// import protect from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.put("/approve/:requestId", protect, approveStockRequest);
// router.put("/reject/:requestId", protect, rejectStockRequest);
// router.get("/", protect, getAllAllocations);

// export default router;

// import express from "express";
// import {
//   getAllAllocations,
//   approveStockRequest,
//   rejectStockRequest
// } from "../controllers/AllocationController.js";

// import protect from "../middleware/authMiddleware.js";

// const router = express.Router();

// // All routes require login
// router.get("/", protect, getAllAllocations);
// router.post("/approve", protect, approveStockRequest);
// router.post("/reject", protect, rejectStockRequest);

// export default router;

import express from "express";
import {
  getPendingRequests,
  approveStockRequest,
  rejectStockRequest,
  getAllocationHistory
} from "../controllers/AllocationController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/pending", protect, getPendingRequests);
router.put("/approve/:id", protect, approveStockRequest);
router.put("/reject/:id", protect, rejectStockRequest);
router.get("/history", protect, getAllocationHistory);

export default router;





