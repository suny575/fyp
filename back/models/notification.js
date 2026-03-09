import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "WORKORDER_ASSIGNED",
        "TASK_CREATED",
        "SCHEDULE_CREATED",
        "WORKORDER_CREATED",
        "FAULT_REPORTED",
        "NEW_USER_REGISTERED",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed }, // store workOrderId, scheduleId, etc.
  },
  { timestamps: true },
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
