const express = require("express");
const router = express.Router();
const Stock = require("../models/Stock");

// Add stock
router.post("/", async (req, res) => {
  try {
    const stock = new Stock(req.body);
    await stock.save();
    res.status(201).json(stock);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all stock
router.get("/", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Update stock
router.put("/:id", async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(stock);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Delete stock
router.delete("/:id", async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
