import express from "express";
import login from "./routes/login.js";
import register from "./routes/register.js";
import invitationRoutes from "./routes/invitationRoute.js";
import equipmentRoutes from "./routes/equipmentRoute.js";
import stockRoutes from "./routes/stockRoute.js";
import stockRequestRoutes from "./routes/StockRequestRoutes.js";
import allocationRoutes from "./routes/allocationRoutes.js";
import alertsRoutes from "./routes/alerts.js";
import reportsRoutes from "./routes/reports.js";
import pharmacyRoutes from "./routes/pharmacyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutesAdmin from "./routes/notificationRoutesAdmin.js";
import adminReports from "./routes/adminReports.js";
import logsRoutesAdmin from "./routes/logsRoutesAdmin.js";
import adminSettingsRoutes from "./routes/adminSettingsRoutes.js";



// import technicianRoutes from "./routes/technicianRoute.js";

// import technicianRoutes from "./routes/technicianRoute.js";
import faultRoutes from "./routes/faultRoutes.js";
import taskRoutes from "./routes/taskRoute.js";
import managerRoutes from "./routes/managerRoutes.js"; // for manager summer data
import EquipmentReportRouts from "./routes/equipmentReportRoutes.js";
import User from "./routes/user.js";
// import alertsRoutes from "./routes/alerts.js";
// import reportsRoutes from "./routes/reports.js";
// import alertsRoutes from "./routes/alerts.js"
// import pharmacyRoutes from "./routes/pharmacyRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
import Notification from "./models/Notification.js";
import Schedule from "./routes/scheduledMaintenanceRoutes.js";
import maintenanceLog from "./routes/maintenanceLogRoutes.js";
import workOrder from "./routes/workOrderRoutes.js";
const app = express();

app.use(express.json());

app.use("/login", login);
app.use("/register", register);
app.use("/manager/users", User);
app.use("/invitations", invitationRoutes);
app.use("/faults", faultRoutes);
app.use("/tasks", taskRoutes);
app.use("/managerRoutes", managerRoutes);
app.use("/equipment", equipmentRoutes);
app.use("/stock", stockRoutes);
app.use("/stock-requests", stockRequestRoutes);
app.use("/allocations", allocationRoutes);
app.use("/equipmentReportRoutes.js", EquipmentReportRouts);
app.use("/schedules", Schedule);
app.use("/alerts", alertsRoutes);
app.use("/notifications", Notification);
app.use("/reports", reportsRoutes);
app.use("/pharmacy", pharmacyRoutes);
app.use("/admin", adminRoutes);
app.use("/equipmentReportRoutes.js", EquipmentReportRouts);
app.use("/admin/notifications", notificationRoutesAdmin); 
app.use("/admin", adminReports);
app.use("/admin/system-logs", logsRoutesAdmin);
app.use("/admin/settings", adminSettingsRoutes);



app.use("/maintenanceLog", maintenanceLog);
app.use("/workOrder", workOrder);
app.get("/", (req, res) => {
  res.send("Hospital Equipment Maintenance API Running");
});

export default app;
