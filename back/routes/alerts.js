import express from "express";
import Stock from "../models/stock.js";
import StockRequest from "../models/StockRequest.js";
import protect from "../middleware/authMiddleware.js";
import { withHospitalScope } from "../utils/hospitalScope.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const today = new Date();

    const expiredStock = await Stock.find(
      withHospitalScope(
        {
          category: "Consumable",
          expiry: { $lt: today },
        },
        req.user.hospital,
      ),
    ).select("name expiry");

    const expiredAlerts = expiredStock.map((item) => ({
      type: "Expired Stock",
      name: item.name,
      message: "Expired stock found",
      date: item.expiry,
    }));

    const lowStock = await Stock.find(
      withHospitalScope({ quantity: { $lte: 10 } }, req.user.hospital),
    ).select("name quantity");

    const lowStockAlerts = lowStock.map((item) => ({
      type: "Low Stock",
      name: item.name,
      message: `Stock below threshold (${item.quantity})`,
      date: new Date(),
    }));

    const pendingRequests = await StockRequest.find(
      withHospitalScope({ status: "pending" }, req.user.hospital),
    )
      .populate("requestedBy", "name")
      .select("item department createdAt");

    const pendingAlerts = pendingRequests.map((request) => ({
      type: "Pending Stock Request",
      name: request.item,
      message: `Request pending from ${request.department}`,
      date: request.createdAt,
    }));

    res.json([...expiredAlerts, ...lowStockAlerts, ...pendingAlerts]);
  } catch (err) {
    console.error("Failed to fetch alerts:", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

export default router;
