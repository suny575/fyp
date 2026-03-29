import express from "express";
import {
  getAllStock,
  createStock,
  updateStock,
  deleteStock,
} from "../controllers/stockController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getAllStock);
router.post("/", createStock);
router.put("/:id", updateStock);
router.delete("/:id", deleteStock);

export default router;
