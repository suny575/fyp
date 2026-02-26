import express from "express";
import {
  getAllStock,
  createStock,
  updateStock,
  deleteStock,
} from "../controllers/stockController.js";

const router = express.Router();

router.get("/", getAllStock);
router.post("/", createStock);
router.put("/:id", updateStock);
router.delete("/:id", deleteStock);

export default router;