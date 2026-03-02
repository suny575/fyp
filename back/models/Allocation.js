
// models/Allocation.js
import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Stock", "Equipment"],
    required: true,
  },
  itemName: {               // for stock or equipment name
    type: String,
    required: true,
  },
  department: {             // which department received it
    type: String,
    required: true,
  },
  quantity: {               // 1 for equipment, requestedQty for stock
    type: Number,
    required: true,
  },

    // ✅ Requested by (for stock requests)
  requestedBy: {             
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  requestedByName: {
    type: String,
  },

  
  allocatedBy: {            // user ID who allocated
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  allocatedByName: {        // for frontend display
    type: String,
    required: true,
  },
  date: {                   // date of allocation
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Allocation = mongoose.model("Allocation", allocationSchema);

export default Allocation;