// controllers/notificationController.js
import Notification from "../models/notification.js";

// Get notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id, // fixed from old code
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
