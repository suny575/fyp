import StockRequest from "../models/StockRequest.js";
import { resolveHospitalName, withHospitalScope } from "../utils/hospitalScope.js";

export const createStockRequest = async (req, res) => {
  try {
    const { item, quantity, department, reason } = req.body;
    const newRequest = new StockRequest({
      item,
      quantity,
      hospital: resolveHospitalName(req.user.hospital),
      department,
      reason,
      requestedBy: req.user._id,
    });
    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllStockRequests = async (req, res) => {
  try {
    const requests = await StockRequest.find(
      withHospitalScope({}, req.user.hospital),
    ).populate("requestedBy", "name email hospital");
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStockRequestById = async (req, res) => {
  try {
    const request = await StockRequest.findOne(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    ).populate("requestedBy", "name email hospital");

    if (!request) return res.status(404).json({ message: "Request not found" });
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStockRequest = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedRequest = await StockRequest.findOneAndUpdate(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
      { status, allocationDate: status === "approved" ? new Date() : null },
      { new: true },
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(updatedRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteStockRequest = async (req, res) => {
  try {
    const deleted = await StockRequest.findOneAndDelete(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    );
    if (!deleted) return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
