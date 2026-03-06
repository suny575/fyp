import Notification from "../models/AdminNotification.js";

// Get all notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a notification
export const createNotification = async (req, res) => {
  try {
    const { type, message, time } = req.body;
    const notification = await Notification.create({ type, message, time });
    res.status(201).json({ notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    await notification.deleteOne();
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};