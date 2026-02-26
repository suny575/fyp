// import Stock from "../models/stock.js";
// import StockRequest from "../models/StockRequest.js";
// import Allocation from "../models/Allocation.js";

// // Approve a stock request and create allocation
// export const approveStockRequest = async (req, res) => {
//   try {
//     const { requestId } = req.params;
//     const userId = req.user._id; // allocatedBy

//     // Find the stock request
//     const request = await StockRequest.findById(requestId);
//     if (!request) return res.status(404).json({ message: "Request not found" });

//     // Find stock
//     const stock = await Stock.findOne({ name: request.item });
//     if (!stock) return res.status(404).json({ message: "Stock not found" });

//     if (request.quantity > stock.quantity)
//       return res.status(400).json({ message: "Not enough stock" });

//     // Deduct stock
//     stock.quantity -= request.quantity;
//     await stock.save();

//     // Update request status
//     request.status = "approved";
//     await request.save();

//     // Create allocation record
//     const allocation = new Allocation({
//       type: "Stock",
//       name: request.item,
//       department: request.department,
//       quantity: request.quantity,
//       allocatedBy: userId,
//     });
//     await allocation.save();

//     res.status(200).json({ message: "Stock approved and allocated", allocation });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // Reject a stock request
// export const rejectStockRequest = async (req, res) => {
//   try {
//     const { requestId } = req.params;
//     const request = await StockRequest.findById(requestId);
//     if (!request) return res.status(404).json({ message: "Request not found" });

//     request.status = "rejected";
//     await request.save();

//     res.status(200).json({ message: "Stock request rejected", request });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get all allocations (for history table)
// export const getAllAllocations = async (req, res) => {
//   try {
//     const allocations = await Allocation.find()
//       .populate("allocatedBy", "name email")
//       .sort({ date: -1 });

//     res.status(200).json(allocations);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// import Allocation from "../models/Allocation.js";
// import Stock from "../models/stock.js";

// // ✅ Get all allocations (history)
// export const getAllAllocations = async (req, res) => {
//   try {
//     const allocations = await Allocation.find()
//       .populate("allocatedBy", "name email")
//       .populate("stockItem", "name quantity")
//       .populate("equipment", "name");
//     res.status(200).json(allocations);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Approve a stock request and create allocation
// export const approveStockRequest = async (req, res) => {
//   try {
//     const { stockRequestId, allocatedById } = req.body;

//     // Fetch the stock request
//     const stockRequest = await StockRequest.findById(stockRequestId);
//     if (!stockRequest) return res.status(404).json({ message: "Request not found" });

//     if (stockRequest.quantity > stockRequest.availableQty) {
//       return res.status(400).json({ message: "Insufficient stock!" });
//     }

//     // Reduce stock quantity
//     stockRequest.availableQty -= stockRequest.quantity;
//     await stockRequest.save();

//     // Create allocation record
//     const allocation = await Allocation.create({
//       type: "Stock",
//       name: stockRequest.item.name,
//       department: stockRequest.department,
//       quantity: stockRequest.quantity,
//       allocatedBy: allocatedById,
//       stockItem: stockRequest.item._id,
//       date: new Date(),
//     });

//     // Optionally mark stock request as approved
//     stockRequest.status = "approved";
//     stockRequest.allocationDate = new Date();
//     await stockRequest.save();

//     res.status(201).json(allocation);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Reject stock request
// export const rejectStockRequest = async (req, res) => {
//   try {
//     const { stockRequestId } = req.body;
//     const stockRequest = await StockRequest.findById(stockRequestId);
//     if (!stockRequest) return res.status(404).json({ message: "Request not found" });

//     stockRequest.status = "rejected";
//     await stockRequest.save();

//     res.status(200).json({ message: "Request rejected" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import StockRequest from "../models/StockRequest.js";
import Stock from "../models/stock.js";
import Equipment from "../models/equipment.js";

/*
========================================
1️⃣ GET PENDING STOCK REQUESTS
========================================
*/
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await StockRequest
      .find({ status: "pending" })
      .populate("requestedBy", "name");

    const formatted = await Promise.all(
      requests.map(async (r) => {
        const stock = await Stock.findOne({ name: r.item });

        return {
          id: r._id,
          name: r.item,
          requestedQty: r.quantity,
          department: r.department,
          requestedBy: r.requestedBy?.name,
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
    const request = await StockRequest.findById(req.params.id);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending")
      return res.status(400).json({ message: "Request already processed" });

    const stock = await Stock.findOne({ name: request.item });

    if (!stock || stock.quantity < request.quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    // Reduce stock safely
    stock.quantity -= request.quantity;
    await stock.save();

    // Update request
    request.status = "approved";
    request.allocationDate = new Date();
    await request.save();

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

    res.status(200).json({ message: "Stock allocation rejected" });

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

    // Approved stock requests
    const approvedStock = await StockRequest
      .find({ status: "approved" })
      .populate("requestedBy", "name");

    const stockHistory = approvedStock.map(r => ({
      id: r._id,
      type: "Stock",
      name: r.item,
      department: r.department,
      quantity: r.quantity,
      allocatedBy: r.requestedBy?.name,
      date: r.allocationDate
        ? r.allocationDate.toISOString().split("T")[0]
        : "",
    }));

    // Equipment allocations
    const equipments = await Equipment
      .find()
      .populate("allocatedBy", "name");

    const equipmentHistory = equipments.map(eq => ({
      id: eq._id,
      type: "Equipment",
      name: eq.name,
      department: eq.department,
      quantity: 1,
      allocatedBy: eq.allocatedBy?.name,
      date: eq.allocationDate
        ? eq.allocationDate.toISOString().split("T")[0]
        : "",
    }));

    res.status(200).json([
      ...equipmentHistory,
      ...stockHistory
    ]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



