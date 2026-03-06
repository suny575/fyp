import express from "express";
import {
  createWorkOrder,
  getWorkOrders,
  assignTechnician,
  getWorkOrderById,
} from "../controllers/workOrderController.js";

const router = express.Router();

// Get all work orders
router.get("/", getWorkOrders);

// Create work order (usually triggered by schedule)
router.post("/", createWorkOrder);

// Assign technician to work order
router.post("/:id/assign-technician", assignTechnician);

// Get single work order
router.get("/:id", getWorkOrderById);

export default router;
