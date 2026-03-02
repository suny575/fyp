// import express from "express";
// import Stock from "../models/stock.js";
// import Equipment from "../models/equipment.js";
// import Allocation from "../models/Allocation.js";

// const router = express.Router();

// // =============================
// // GET /api/reports
// // =============================
// router.get("/", async (req, res) => {
//   try {
//     const { reportType, dateFrom, dateTo } = req.query;

//     const fromDate = dateFrom ? new Date(dateFrom) : null;
//     const toDate = dateTo ? new Date(dateTo) : null;

//     let records = [];

//     // ================= INVENTORY =================
//     if (reportType === "Inventory") {

//       const equipment = await Equipment.find({});
//       const stock = await Stock.find({});

//       const equipmentData = equipment.map(e => ({
//         type: "Equipment",
//         name: e.name,
//         category: "Equipment",
//         department: e.department,
//         quantity: 1,
//         allocatedBy: e.allocatedBy,
//         date: e.purchaseDate
//       }));

//       const stockData = stock.map(s => ({
//         type: "Stock",
//         name: s.name,
//         category: s.category,
//         department: "-",
//         quantity: s.quantity,
//         allocatedBy: "-",
//         date: s.createdAt   // ✅ registration date
//       }));

//       records = [...equipmentData, ...stockData];
//     }

//     // ================= USAGE =================
//     else if (reportType === "Usage") {

//       const allocations = await Allocation.find({});

//       records = allocations.map(a => ({
//         type: a.type,
//         name: a.itemName,
//         category: a.type === "Equipment" ? "Equipment" : "Stock",
//         department: a.department,
//         quantity: a.quantity,
//         allocatedBy: a.allocatedByName,
//         date: a.date
//       }));
//     }

//     // ================= LOW STOCK =================
//     else if (reportType === "Low Stock") {

//       const lowStock = await Stock.find({ quantity: { $lte: 10 } });

//       records = lowStock.map(s => ({
//         type: "Stock",
//         name: s.name,
//         category: s.category,
//         department: "-",
//         quantity: s.quantity,
//         allocatedBy: "-",
//         date: s.createdAt
//       }));
//     }

//     // ================= EXPIRED =================
//     else if (reportType === "Expiry") {

//       const today = new Date();

//       const expiredStock = await Stock.find({
//         expiry: { $lte: today }
//       });

//       records = expiredStock.map(s => ({
//         type: "Stock",
//         name: s.name,
//         category: s.category,
//         department: "-",
//         quantity: s.quantity,
//         allocatedBy: "-",
//         date: s.expiry
//       }));
//     }

//     // ================= DATE FILTER =================
//     if (fromDate || toDate) {
//       records = records.filter(r => {
//         const rDate = new Date(r.date);
//         if (fromDate && rDate < fromDate) return false;
//         if (toDate && rDate > toDate) return false;
//         return true;
//       });
//     }

//     // ================= SUMMARY =================
//     let summary = {};

//     if (reportType === "Inventory") {
//       const totalEquipment = records.filter(r => r.type === "Equipment").length;
//       const totalStock = records
//         .filter(r => r.type === "Stock")
//         .reduce((acc, r) => acc + r.quantity, 0);

//       summary = { totalEquipment, totalStock };
//     }

//     else if (reportType === "Usage") {
//       summary = { totalAllocations: records.length };
//     }

//     else if (reportType === "Low Stock") {
//       summary = { totalLowItems: records.length };
//     }

//     else if (reportType === "Expiry") {
//       summary = { totalExpired: records.length };
//     }

//     res.json({ records, summary });

//   } catch (err) {
//     console.error("Reports error:", err);
//     res.status(500).json({ error: "Failed to fetch reports" });
//   }
// });

// export default router;


import express from "express";
import Stock from "../models/stock.js";
import Equipment from "../models/equipment.js";
import Allocation from "../models/Allocation.js";

const router = express.Router();

// =============================
// GET /api/reports
// =============================
router.get("/", async (req, res) => {
  try {
    const { reportType, dateFrom, dateTo } = req.query;

    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    let records = [];

    // ================= INVENTORY =================
    if (reportType === "Inventory") {
      const equipment = await Equipment.find({});
      const stock = await Stock.find({});

      const equipmentData = equipment.map(e => ({
        type: "Equipment",
        name: e.name,
        category: "Equipment",
        department: e.department,
        quantity: 1,
        allocatedBy: e.allocatedBy,
        date: e.purchaseDate
      }));

      const stockData = stock.map(s => ({
        type: "Stock",
        name: s.name,
        category: s.category,
        department: "-",
        quantity: s.quantity,
        allocatedBy: "-",
        date: s.createdAt
      }));

      records = [...equipmentData, ...stockData];
    }

    // ================= USAGE =================
    else if (reportType === "Usage") {
      const allocations = await Allocation.find({}); // Stock allocations
      const equipments = await Equipment.find({});   // Equipment allocations

      const stockRecords = allocations.map(a => ({
        type: "Stock",
        name: a.itemName,
        category: "Stock",
        department: a.department,
        quantity: a.quantity,
        allocatedBy: a.allocatedByName,
        date: a.date
      }));

      const equipmentRecords = equipments.map(eq => ({
        type: "Equipment",
        name: eq.name,
        category: "Equipment",
        department: eq.department,
        quantity: 1,
        allocatedBy: eq.allocatedBy?.name || "Unknown",
        date: eq.allocationDate || eq.createdAt
      }));

      records = [...stockRecords, ...equipmentRecords];
    }

    // ================= LOW STOCK =================
    else if (reportType === "Low Stock") {
      const lowStock = await Stock.find({ quantity: { $lte: 10 } });

      records = lowStock.map(s => ({
        type: "Stock",
        name: s.name,
        category: s.category,
        department: "-",
        quantity: s.quantity,
        allocatedBy: "-",
        date: s.createdAt
      }));
    }

    // ================= EXPIRED =================
    else if (reportType === "Expiry") {
      const today = new Date();

      const expiredStock = await Stock.find({
        expiry: { $lte: today }
      });

      records = expiredStock.map(s => ({
        type: "Stock",
        name: s.name,
        category: s.category,
        department: "-",
        quantity: s.quantity,
        allocatedBy: "-",
        date: s.expiry
      }));
    }

    // ================= DATE FILTER =================
    if (fromDate || toDate) {
      records = records.filter(r => {
        const rDate = new Date(r.date);
        if (fromDate && rDate < fromDate) return false;
        if (toDate && rDate > toDate) return false;
        return true;
      });
    }

    // ================= SUMMARY =================
    let summary = {};

    if (reportType === "Inventory") {
      const totalEquipment = records.filter(r => r.type === "Equipment").length;
      const totalStock = records
        .filter(r => r.type === "Stock")
        .reduce((acc, r) => acc + r.quantity, 0);

      summary = { totalEquipment, totalStock };
    }

    else if (reportType === "Usage") {
      summary = { totalAllocations: records.length };
    }

    else if (reportType === "Low Stock") {
      summary = { totalLowItems: records.length };
    }

    else if (reportType === "Expiry") {
      summary = { totalExpired: records.length };
    }

    res.json({ records, summary });

  } catch (err) {
    console.error("Reports error:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

export default router;