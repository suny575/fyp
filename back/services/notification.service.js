import Notification from "../models/notification.js";
import User from "../models/user.js";
import notificationTemplates from "./notificationTemplates.js";
import sendEmail from "./email.service.js";
import { getIo } from "./socket.service.js";

export const sendNotification = async ({
  trigger,
  recipientUsers,
  payload,
}) => {
  for (const userId of recipientUsers) {
    const user = await User.findById(userId);
    if (!user) continue;

    const template = notificationTemplates[trigger](user, payload);

    const notification = await Notification.create({
      recipient: userId,
      type: trigger,
      title: template.title,
      message: template.message,
      metadata: payload,
    });

    const io = getIo();
    if (io) {
      io.to(userId.toString()).emit("newNotification", notification);
    }

    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: template.emailSubject,
        html: template.emailBody,
      });
    }
  }
};
