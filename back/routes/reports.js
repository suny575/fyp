import express from "express";
import Stock from "../models/stock.js";
import Equipment from "../models/equipment.js";
import Allocation from "../models/Allocation.js";
import protect from "../middleware/authMiddleware.js";
import { withHospitalScope } from "../utils/hospitalScope.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const { reportType, dateFrom, dateTo } = req.query;

    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    let records = [];

    if (reportType === "Inventory") {
      const equipment = await Equipment.find(
        withHospitalScope({}, req.user.hospital),
      ).populate("allocatedBy", "name");
      const stock = await Stock.find(withHospitalScope({}, req.user.hospital));

      const equipmentData = equipment.map((item) => ({
        type: "Equipment",
        name: item.name,
        category: "Equipment",
        department: item.department,
        quantity: 1,
        allocatedBy: item.allocatedBy?.name || "Unknown",
        date: item.purchaseDate,
      }));

      const stockData = stock.map((item) => ({
        type: "Stock",
        name: item.name,
        category: item.category,
        department: "-",
        quantity: item.quantity,
        allocatedBy: "-",
        date: item.createdAt,
      }));

      records = [...equipmentData, ...stockData];
    } else if (reportType === "Usage") {
      const allocations = await Allocation.find(
        withHospitalScope({}, req.user.hospital),
      );
      const equipments = await Equipment.find(
        withHospitalScope({}, req.user.hospital),
      ).populate("allocatedBy", "name");

      const stockRecords = allocations.map((item) => ({
        type: "Stock",
        name: item.itemName,
        category: "Stock",
        department: item.department,
        quantity: item.quantity,
        allocatedBy: item.allocatedByName,
        date: item.date,
      }));

      const equipmentRecords = equipments.map((item) => ({
        type: "Equipment",
        name: item.name,
        category: "Equipment",
        department: item.department,
        quantity: 1,
        allocatedBy: item.allocatedBy?.name || "Unknown",
        date: item.allocationDate || item.createdAt,
      }));

      records = [...stockRecords, ...equipmentRecords];
    } else if (reportType === "Low Stock") {
      const lowStock = await Stock.find(
        withHospitalScope({ quantity: { $lte: 10 } }, req.user.hospital),
      );

      records = lowStock.map((item) => ({
        type: "Stock",
        name: item.name,
        category: item.category,
        department: "-",
        quantity: item.quantity,
        allocatedBy: "-",
        date: item.createdAt,
      }));
    } else if (reportType === "Expiry") {
      const today = new Date();
      const expiredStock = await Stock.find(
        withHospitalScope({ expiry: { $lte: today } }, req.user.hospital),
      );

      records = expiredStock.map((item) => ({
        type: "Stock",
        name: item.name,
        category: item.category,
        department: "-",
        quantity: item.quantity,
        allocatedBy: "-",
        date: item.expiry,
      }));
    }

    if (fromDate || toDate) {
      records = records.filter((record) => {
        const recordDate = new Date(record.date);
        if (fromDate && recordDate < fromDate) return false;
        if (toDate && recordDate > toDate) return false;
        return true;
      });
    }

    let summary = {};

    if (reportType === "Inventory") {
      summary = {
        totalEquipment: records.filter((record) => record.type === "Equipment")
          .length,
        totalStock: records
          .filter((record) => record.type === "Stock")
          .reduce((acc, record) => acc + record.quantity, 0),
      };
    } else if (reportType === "Usage") {
      summary = { totalAllocations: records.length };
    } else if (reportType === "Low Stock") {
      summary = { totalLowItems: records.length };
    } else if (reportType === "Expiry") {
      summary = { totalExpired: records.length };
    }

    res.json({ records, summary });
  } catch (err) {
    console.error("Reports error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

export default router;
