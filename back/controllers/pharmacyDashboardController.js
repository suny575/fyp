
import Equipment from "../models/equipment.js";
import Stock from "../models/stock.js";
import Allocation from "../models/Allocation.js";

// Pharmacy Dashboard
export const getPharmacyDashboard = async (req, res) => {
  try {
    const today = new Date();

    // 1️⃣ Total Equipment
    const totalEquipment = await Equipment.countDocuments();

    // 2️⃣ Total Stock
    const totalStock = await Stock.countDocuments();

    // 3️⃣ Low Stock (quantity <= 10)
    const lowStock = await Stock.countDocuments({
      quantity: { $lte: 10 }
    });

    // 4️⃣ Expired Stock (expiry < today)
    const expired = await Stock.countDocuments({
      expiry: { $lt: today }
    });

    // 5️⃣ Total Allocations (stock + equipment allocations)
    const stockAllocations = await Allocation.countDocuments({ type: "Stock" });
    const equipmentAllocations = await Equipment.countDocuments({ allocatedBy: { $exists: true } });
    const totalAllocations = stockAllocations + equipmentAllocations;

    // 6️⃣ Reports generated
    // Each type of report counts as one “report generated”
    const totalReports = totalStock + totalAllocations + expired + lowStock;

    res.json({
      totalEquipment,
      totalStock,
      lowStock,
      expired,
      totalAllocations,
      totalReports
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};