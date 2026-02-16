const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  reorderLevel: { type: Number, default: 5 },
  supplier: String,
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Stock", stockSchema);
