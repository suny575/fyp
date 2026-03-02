
// controllers/allocationController.js
import StockRequest from "../models/StockRequest.js";
import Stock from "../models/stock.js";
import Equipment from "../models/equipment.js";
import Allocation from "../models/Allocation.js";

/*
========================================
1️⃣ GET PENDING STOCK REQUESTS
========================================
*/
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await StockRequest
      .find({ status: "pending" })
      .populate("requestedBy", "name email"); // include name for frontend

    const formatted = await Promise.all(
      requests.map(async (r) => {
        const stock = await Stock.findOne({ name: r.item });

        return {
          id: r._id,
          itemName: r.item,                       // frontend expects itemName
          requestedQty: r.quantity,
          department: r.department,
          requestedByName: r.requestedBy?.name || "Unknown",
          availableQty: stock ? stock.quantity : 0,
        };
      })
    );

    res.status(200).json(formatted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/*
========================================
2️⃣ APPROVE STOCK REQUEST
========================================
*/
export const approveStockRequest = async (req, res) => {
  try {
    const request = await StockRequest.findById(req.params.id).populate("requestedBy", "name");

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending")
      return res.status(400).json({ message: "Request already processed" });

    const stock = await Stock.findOne({ name: request.item });
    if (!stock || stock.quantity < request.quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    // Reduce stock
    stock.quantity -= request.quantity;
    await stock.save();

    // Update request
    request.status = "approved";
    request.allocationDate = new Date();
    await request.save();

    // Add allocation history
    const allocation = new Allocation({
      type: "Stock",
      itemName: request.item,
      department: request.department,
      quantity: request.quantity,
      
      requestedBy: request.requestedBy._id,           // who requested
      requestedByName: request.requestedBy?.name,     // name of requester

      allocatedBy: req.user._id,         // the approver
      allocatedByName: req.user.name,    // display name of approver
      // allocatedBy: request.requestedBy._id,
      // allocatedByName: request.requestedBy?.name || "Unknown",
      date: request.allocationDate,
    });
    await allocation.save();

    res.status(200).json({ message: "Stock allocation approved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/*
========================================
3️⃣ REJECT STOCK REQUEST
========================================
*/
export const rejectStockRequest = async (req, res) => {
  try {
    const request = await StockRequest.findById(req.params.id);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending")
      return res.status(400).json({ message: "Request already processed" });

    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Stock allocation rejected", id: request._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/*
========================================
4️⃣ GET ALLOCATION HISTORY
========================================
*/
export const getAllocationHistory = async (req, res) => {
  try {
    // Stock allocations from Allocation collection
    const stockAllocations = await Allocation.find({ type: "Stock" });

    const stockHistory = stockAllocations.map(r => ({
      id: r._id,
      type: r.type,
      name: r.itemName,                      // frontend expects 'name'
      department: r.department,
      quantity: r.quantity,
      allocatedByName: r.allocatedByName || "Unknown",
      date: r.date ? r.date.toISOString().split("T")[0] : "",
    }));

    // Equipment allocations
    const equipments = await Equipment.find().populate("allocatedBy", "name");

    const equipmentHistory = equipments.map(eq => ({
      id: eq._id,
      type: "Equipment",
      name: eq.name,
      department: eq.department,
      quantity: 1,
      allocatedByName: eq.allocatedBy?.name || "Unknown",
      date: eq.allocationDate ? eq.allocationDate.toISOString().split("T")[0] : "",
    }));

    res.status(200).json([
      ...equipmentHistory,
      ...stockHistory
    ]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};