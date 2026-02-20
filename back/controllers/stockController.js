import StockRequest from "../models/StockRequest.js";

// Submit stock request
export const submitStockRequest = async (req, res) => {
  const { item, quantity, reason } = req.body;
  try {
    const request = await StockRequest.create({
      requestedBy: req.user._id,
      item,
      quantity,
      reason,
    });
    res.status(201).json({ message: "Stock request submitted", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all stock requests by user
export const getUserStockRequests = async (req, res) => {
  try {
    const requests = await StockRequest.find({
      requestedBy: req.user._id,
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
