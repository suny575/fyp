// services/notificationTemplates.js
import io from "../server.js";

export const sendNotification = ({ trigger, recipientUsers, payload }) => {
  for (const userId of recipientUsers) {
    io.to(userId.toString()).emit("newNotification", {
      trigger,
      payload,
    });
  }
};

export const notificationTemplates = {
  WORKORDER_ASSIGNED: (user, data) => ({
    title: "New Work Order Assigned",
    message: `Hi ${user.name}, a new work order (#${data.workOrderId}) has been assigned to you for ${data.equipmentName} scheduled on ${data.scheduledDate}.`,
    emailSubject: "New Work Order Assigned",
    emailBody: `Hello ${user.name},<br>You have a new work order (#${data.workOrderId}) for ${data.equipmentName} scheduled on ${data.scheduledDate}. Please start your task promptly.<br>Link: <a href="${data.link}">${data.link}</a>`,
  }),
  TASK_CREATED: (user, data) => ({
    title: "New Task Assigned",
    message: `Hi ${user.name}, you have been assigned a new task (from a reported fault on ${data.equipmentName}).`,
    emailSubject: "New Task Assigned",
    emailBody: `Hello ${user.name},<br>You have been assigned a new task from a reported fault on ${data.equipmentName}. Please start your task.<br>Link: <a href="${data.link}">${data.link}</a>`,
  }),
  SCHEDULE_CREATED: (user, data) => ({
    title: "New Schedule Created",
    message: `Hi ${user.name}, a new maintenance schedule for ${data.equipmentName} has been created.`,
    emailSubject: "New Maintenance Schedule",
    emailBody: `Hello ${user.name},<br>A new maintenance schedule has been created for ${data.equipmentName}.<br>Link: <a href="${data.link}">${data.link}</a>`,
  }),
  WORKORDER_CREATED: (user, data) => ({
    title: "Work Order Created",
    message: `Hi ${user.name}, a work order (#${data.workOrderId}) has been created for schedule #${data.scheduleId}, but no technician is assigned yet.`,
    emailSubject: "Work Order Created",
    emailBody: `Hello ${user.name},<br>A work order (#${data.workOrderId}) has been created for schedule #${data.scheduleId}, but no technician is assigned yet.<br>Link: <a href="${data.link}">${data.link}</a>`,
  }),
  FAULT_REPORTED: (user, data) => ({
    title: "Fault Report Submitted",
    message: `Hi ${user.name}, your maintenance request for ${data.equipmentName} has been received.`,
    emailSubject: "Fault Report Received",
    emailBody: `Hello ${user.name},<br>Your maintenance request for ${data.equipmentName} has been received.<br>Link: <a href="${data.link}">${data.link}</a>`,
  }),
  NEW_USER_REGISTERED: (user, data) => ({
    title: "New User Registered",
    message: `Hi ${user.name}, user ${data.username} with role ${data.role} has registered.`,
    emailSubject: "New User Registration",
    emailBody: `Hello ${user.name},<br>User ${data.username} with role ${data.role} has registered.<br>Link: <a href="${data.link}">${data.link}</a>`,
  }),
};

export default notificationTemplates;
