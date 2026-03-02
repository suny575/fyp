import nodemailer from "nodemailer";
import Notification from "../models/Notification.js";

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendNotification = async ({
  recipients = [],
  type,
  message,
  metadata = {},
}) => {
  try {
    if (!Array.isArray(recipients)) {
      console.error("Recipients is not an array:", recipients);
      return;
    }

    for (const user of recipients) {
      if (!user?._id) continue;

      // ✅ Save to database using correct field name: recipient
      await Notification.create({
        recipient: user._id, // MATCHES YOUR SCHEMA
        type,
        message,
        metadata,
      });

      // ✅ Send email if available
      if (user.email) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Maintenance System Notification",
          html: `<p>${message}</p>`,
        });
      }

      console.log(`Notification sent to ${user.name}`);
    }
  } catch (err) {
    console.error("Notification error:", err);
  }
};

export default sendNotification;
