const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: {
    type: String,
    enum: [
      "admin",
      "technician",
      "maintenanceManager",
      "depStaff",
      "pharmacyStore",
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invitation", invitationSchema);
