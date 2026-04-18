import express from "express";
import {
  getWorkOrders,
  assignTechnician,
  getWorkOrderById,
  updateWorkOrderStatus,
  startMaintenance,
  submitMaintenanceResult,
} from "../controllers/workOrderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getWorkOrders);
router.post("/:id/assign-technician", assignTechnician);
router.get("/:id", getWorkOrderById);
router.put("/status/:id", updateWorkOrderStatus);
router.put("/start/:id", startMaintenance);
router.put("/result/:id", submitMaintenanceResult);

export default router;
