import express from "express";
import {
  getWorkOrders,
  assignTechnician,
  getWorkOrderById,
  updateWorkOrderStatus,
} from "../controllers/workOrderController.js";

const router = express.Router();

// Get all work orders
router.get("/", getWorkOrders);

// Assign technician to work order
router.post("/:id/assign-technician", assignTechnician);

// Get single work order
router.get("/:id", getWorkOrderById);
router.put("/status/:id", updateWorkOrderStatus);

export default router;
