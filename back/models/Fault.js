import mongoose from "mongoose";

const faultSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // ✅ allow null
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // ✅ allow null
    },
    description: {
      type: String,
      required: true,
    },
    media: {
      images: [{ type: String }],
      voiceNote: { type: String },
    },
    department: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "approved", "rejected", "convertedToTask"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true },
);

// ⚡ Middleware to track status updates
faultSchema.pre("save", function () {
  if (this.isModified("status") && !this.updatedBy) {
    this.updatedBy = null;
  }
});

const Fault = mongoose.models.Fault || mongoose.model("Fault", faultSchema);

export default Fault;
