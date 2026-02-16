const mongoose = require("mongoose");

const maintenanceLogSchema = new mongoose.Schema({
  equipmentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: String,
  completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MaintenanceLog", maintenanceLogSchema);
