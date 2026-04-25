import Stock from "../models/stock.js";
import {
  resolveHospitalName,
  withHospitalScope,
} from "../utils/hospitalScope.js";

export const getAllStock = async (req, res) => {
  try {
    const stock = await Stock.find(withHospitalScope({}, req.user.hospital));
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createStock = async (req, res) => {
  try {
    console.log("[MongoDB][Stock][Create] Request received", {
      userId: req.user?._id?.toString(),
      hospital: resolveHospitalName(req.user?.hospital),
      itemName: req.body?.itemName || req.body?.name,
    });

    const newStock = new Stock({
      ...req.body,
      hospital: resolveHospitalName(req.user.hospital),
    });
    const savedStock = await newStock.save();
    console.log("[MongoDB][Stock][Create] Insert successful", {
      id: savedStock?._id?.toString(),
      hospital: savedStock?.hospital,
      itemName: savedStock?.itemName || savedStock?.name,
    });
    res.status(201).json(savedStock);
  } catch (err) {
    console.error("[MongoDB][Stock][Create] Insert failed", err.message);
    res.status(400).json({ message: err.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findOneAndUpdate(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
      req.body,
      { new: true },
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock item not found" });
    }

    res.json(updatedStock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteStock = async (req, res) => {
  try {
    console.log("[MongoDB][Stock][Delete] Request received", {
      id: req.params.id,
      hospital: resolveHospitalName(req.user?.hospital),
      userId: req.user?._id?.toString(),
    });

    const deletedStock = await Stock.findOneAndDelete(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    );

    if (!deletedStock) {
      console.log("[MongoDB][Stock][Delete] Record not found", {
        id: req.params.id,
      });
      return res.status(404).json({ message: "Stock item not found" });
    }

    console.log("[MongoDB][Stock][Delete] Delete successful", {
      id: deletedStock?._id?.toString(),
      itemName: deletedStock?.itemName || deletedStock?.name,
      hospital: deletedStock?.hospital,
    });
    res.json({ message: "Stock deleted successfully" });
  } catch (err) {
    console.error("[MongoDB][Stock][Delete] Delete failed", err.message);
    res.status(400).json({ message: err.message });
  }
};
