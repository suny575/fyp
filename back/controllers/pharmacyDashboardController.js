import Equipment from "../models/equipment.js";
import Stock from "../models/stock.js";
import Allocation from "../models/Allocation.js";
import { withHospitalScope } from "../utils/hospitalScope.js";

export const getPharmacyDashboard = async (req, res) => {
  try {
    const today = new Date();

    const totalEquipment = await Equipment.countDocuments(
      withHospitalScope({}, req.user.hospital),
    );

    const totalStock = await Stock.countDocuments(
      withHospitalScope({}, req.user.hospital),
    );

    const lowStock = await Stock.countDocuments(
      withHospitalScope({ quantity: { $lte: 10 } }, req.user.hospital),
    );

    const expired = await Stock.countDocuments(
      withHospitalScope({ expiry: { $lt: today } }, req.user.hospital),
    );

    const stockAllocations = await Allocation.countDocuments(
      withHospitalScope({ type: "Stock" }, req.user.hospital),
    );

    const equipmentAllocations = await Equipment.countDocuments(
      withHospitalScope({ allocatedBy: { $exists: true } }, req.user.hospital),
    );

    const totalAllocations = stockAllocations + equipmentAllocations;
    const totalReports = totalStock + totalAllocations + expired + lowStock;

    res.json({
      totalEquipment,
      totalStock,
      lowStock,
      expired,
      totalAllocations,
      totalReports,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
