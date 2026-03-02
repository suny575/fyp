import express from "express";
import login from "./routes/login.js";
import register from "./routes/register.js";
import invitationRoutes from "./routes/invitationRoute.js";
import equipmentRoutes from "./routes/equipmentRoute.js";
import stockRoutes from "./routes/stockRoute.js";
import stockRequestRoutes from "./routes/StockRequestRoutes.js";
import allocationRoutes from "./routes/allocationRoutes.js";
import faultRoutes from "./routes/faultRoutes.js";
import taskRoutes from "./routes/taskRoute.js";
import managerRoutes from "./routes/managerRoutes.js"; // for manager summer data
import EquipmentReportRouts from "./routes/equipmentReportRoutes.js";
import User from "./routes/user.js";
const app = express();

app.use("/login", login);
app.use("/register", register);
app.use("/manager/users", User);
app.use("/invitations", invitationRoutes);
app.use("/faults", faultRoutes);
app.use("/tasks", taskRoutes);
app.use("managerRoutes", managerRoutes);
app.use("/equipment", equipmentRoutes);
app.use("/stock", stockRoutes);
app.use("/stock-requests", stockRequestRoutes);
app.use("/allocations", allocationRoutes);
app.use("/equipmentReportRoutes.js", EquipmentReportRouts);

app.get("/", (req, res) => {
  res.send("Hospital Equipment Maintenance API Running");
});

export default app;
