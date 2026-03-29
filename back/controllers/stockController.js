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
    const newStock = new Stock({
      ...req.body,
      hospital: resolveHospitalName(req.user.hospital),
    });
    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (err) {
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
    const deletedStock = await Stock.findOneAndDelete(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    );

    if (!deletedStock) {
      return res.status(404).json({ message: "Stock item not found" });
    }

    res.json({ message: "Stock deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
