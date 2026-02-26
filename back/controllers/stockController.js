import Stock from "../models/stock.js";

// GET ALL STOCK
export const getAllStock = async (req, res) => {
  try {
    const stock = await Stock.find();
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE STOCK
export const createStock = async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE STOCK
export const updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE STOCK
export const deleteStock = async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ message: "Stock deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};