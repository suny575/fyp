// import StockRequest from "../models/StockRequest.js";

// export const createStockRequest = async (req, res) => {
//   try {
//     const { stockItem, quantity, department } = req.body;

//     const request = new StockRequest({
//       stockItem,
//       quantity,
//       department,
//       requestedBy: req.user._id
//     });

//     const saved = await request.save();
//     res.status(201).json(saved);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import StockRequest from "../models/StockRequest.js";

// ✅ Create new stock request
export const createStockRequest = async (req, res) => {
  try {
    const { item, quantity, department, reason } = req.body;
    const newRequest = new StockRequest({
      item,
      quantity,
      department,
      reason,
      requestedBy: req.user._id, // from auth middleware
    });
    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all stock requests
export const getAllStockRequests = async (req, res) => {
  try {
    const requests = await StockRequest.find().populate("requestedBy", "name email");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get single stock request
export const getStockRequestById = async (req, res) => {
  try {
    const request = await StockRequest.findById(req.params.id).populate("requestedBy", "name email");
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update stock request (approve/reject)
export const updateStockRequest = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedRequest = await StockRequest.findByIdAndUpdate(
      req.params.id,
      { status, allocationDate: status === "approved" ? new Date() : null },
      { new: true }
    );

    if (!updatedRequest) return res.status(404).json({ message: "Request not found" });

    res.status(200).json(updatedRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete stock request
export const deleteStockRequest = async (req, res) => {
  try {
    const deleted = await StockRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// import StockRequest from "../models/StockRequest.js";

// // Get all stock requests with requestedBy populated
// export const getAllStockRequests = async (req, res) => {
//   try {
//     const requests = await StockRequest.find()
//       .populate("requestedBy", "name email") // only fetch name & email
//       .sort({ createdAt: -1 });
//     res.status(200).json(requests);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Create new stock request
// export const createStockRequest = async (req, res) => {
//   try {
//     const { item, quantity, department } = req.body;

//     const requestedBy = req.user.id; // assuming you have auth middleware

//     const newRequest = new StockRequest({
//       item,
//       quantity,
//       department,
//       requestedBy
//     });

//     const savedRequest = await newRequest.save();

//     // Populate requestedBy for response
//     await savedRequest.populate("requestedBy", "name email");

//     res.status(201).json(savedRequest);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };