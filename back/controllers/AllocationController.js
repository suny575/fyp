import StockRequest from "../models/StockRequest.js";
import Stock from "../models/stock.js";
import Equipment from "../models/equipment.js";
import Allocation from "../models/Allocation.js";
import {
  resolveHospitalName,
  withHospitalScope,
} from "../utils/hospitalScope.js";

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await StockRequest.find(
      withHospitalScope({ status: "pending" }, req.user.hospital),
    ).populate("requestedBy", "name email hospital");

    const formatted = await Promise.all(
      requests.map(async (request) => {
        const stock = await Stock.findOne(
          withHospitalScope({ name: request.item }, req.user.hospital),
        );

        return {
          id: request._id,
          itemName: request.item,
          requestedQty: request.quantity,
          department: request.department,
          requestedByName: request.requestedBy?.name || "Unknown",
          availableQty: stock ? stock.quantity : 0,
        };
      }),
    );

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const approveStockRequest = async (req, res) => {
  try {
    const request = await StockRequest.findOne(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    ).populate("requestedBy", "name hospital");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    const stock = await Stock.findOne(
      withHospitalScope({ name: request.item }, req.user.hospital),
    );

    if (!stock || stock.quantity < request.quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    stock.quantity -= request.quantity;
    await stock.save();

    request.status = "approved";
    request.allocationDate = new Date();
    await request.save();

    const allocation = new Allocation({
      type: "Stock",
      itemName: request.item,
      hospital: resolveHospitalName(req.user.hospital),
      department: request.department,
      quantity: request.quantity,
      requestedBy: request.requestedBy?._id,
      requestedByName: request.requestedBy?.name,
      allocatedBy: req.user._id,
      allocatedByName: req.user.name,
      date: request.allocationDate,
    });
    await allocation.save();

    res.status(200).json({ message: "Stock allocation approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectStockRequest = async (req, res) => {
  try {
    const request = await StockRequest.findOne(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({
      message: "Stock allocation rejected",
      id: request._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllocationHistory = async (req, res) => {
  try {
    const stockAllocations = await Allocation.find(
      withHospitalScope({ type: "Stock" }, req.user.hospital),
    );

    const stockHistory = stockAllocations.map((record) => ({
      id: record._id,
      type: record.type,
      name: record.itemName,
      department: record.department,
      quantity: record.quantity,
      allocatedByName: record.allocatedByName || "Unknown",
      date: record.date ? record.date.toISOString().split("T")[0] : "",
    }));

    const equipments = await Equipment.find(
      withHospitalScope({}, req.user.hospital),
    ).populate("allocatedBy", "name");

    const equipmentHistory = equipments.map((equipment) => ({
      id: equipment._id,
      type: "Equipment",
      name: equipment.name,
      department: equipment.department,
      quantity: 1,
      allocatedByName: equipment.allocatedBy?.name || "Unknown",
      date: equipment.allocationDate
        ? equipment.allocationDate.toISOString().split("T")[0]
        : "",
    }));

    res.status(200).json([...equipmentHistory, ...stockHistory]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
