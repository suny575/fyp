const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  serialNumber: { type: String, unique: true },
  location: String,
  status: {
    type: String,
    enum: ["active", "under-maintenance", "inactive"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Equipment", equipmentSchema);
