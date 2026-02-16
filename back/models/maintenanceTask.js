const mongoose = require("mongoose");

const maintenanceTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  equipmentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MaintenanceTask", maintenanceTaskSchema);
