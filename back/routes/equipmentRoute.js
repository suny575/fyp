
import express from "express";
import {
  addEquipment,
  getAllEquipment,
  updateEquipment,
  deleteEquipment
} from "../controllers/equipmentController.js";

import protect from "../middleware/authMiddleware.js"; // 👈 import middleware

const router = express.Router();

// Only logged-in users can add equipment
router.post("/", protect, addEquipment);

// You can decide if these also need protection
router.get("/", protect, getAllEquipment);
router.put("/:id", protect, updateEquipment);
router.delete("/:id", protect, deleteEquipment);

export default router;