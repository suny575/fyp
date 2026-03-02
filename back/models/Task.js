// models/Task.js
import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
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
      enum: ["waiting", "pendimg", "in_progress", "completed"],
      default: "waiting",
    },

    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    faultRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fault",
      required: true,
    },

    createdBy: {
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
