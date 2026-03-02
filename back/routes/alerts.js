import express from "express";
import Stock from "../models/stock.js";
import StockRequest from "../models/StockRequest.js";

const router = express.Router();

// GET /api/alerts
router.get("/", async (req, res) => {
  try {
    const today = new Date();

    // 1️⃣ Expired stock (consumable items)
    const expiredStock = await Stock.find({
      category: "Consumable",
      expiry: { $lt: today },
    }).select("name expiry");

    // Map to alert format
    const expiredAlerts = expiredStock.map((item) => ({
      type: "Expired Stock",
      name: item.name,
      message: "Expired stock found",
      date: item.expiry,
    }));

    // 2️⃣ Low stock (quantity ≤ threshold)
    const lowStock = await Stock.find({
      quantity: { $lte: 10 }, // you can adjust threshold
    }).select("name quantity");

    const lowStockAlerts = lowStock.map((item) => ({
      type: "Low Stock",
      name: item.name,
      message: `Stock below threshold (${item.quantity})`,
      date: new Date(),
    }));

    // 3️⃣ Pending stock requests
    const pendingRequests = await StockRequest.find({ status: "pending" })
      .populate("requestedBy", "name")
      .select("item department createdAt");

    const pendingAlerts = pendingRequests.map((req) => ({
      type: "Pending Stock Request",
      name: req.item,
      message: `Request pending from ${req.department}`,
      date: req.createdAt,
    }));

    // Combine all alerts
    const allAlerts = [...expiredAlerts, ...lowStockAlerts, ...pendingAlerts];

    res.json(allAlerts);
  } catch (err) {
    console.error("Failed to fetch alerts:", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

export default router;