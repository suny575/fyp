import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Critical", "System"], required: true },
    message: { type: String, required: true },
    time: { type: String, required: true }, // or Date if you want actual timestamps
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.AdminNotification ||
  mongoose.model("AdminNotification", notificationSchema);

export default Notification;