// models/Task.js
import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    // Reference to Equipment model, to get equipment name
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    media: {
      images: [String],
      voiceNote: String,
    },

    department: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["waiting", "inProgress", "completed"],
      default: "waiting",
    },

    // Who the system assigned to fix this task
    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the original fault
    faultRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fault",
      required: true,
    },

    // Who reported this task (department staff)
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    completedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
