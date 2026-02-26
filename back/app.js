import express from "express";
import login from "./routes/login.js";
import register from "./routes/register.js";
import invitationRoutes from "./routes/invitationRoute.js";
import equipmentRoutes from "./routes/equipmentRoute.js";
import stockRoutes from "./routes/stockRoute.js";
import stockRequestRoutes from "./routes/StockRequestRoutes.js";
import allocationRoutes from "./routes/allocationRoutes.js";



// import technicianRoutes from "./routes/technicianRoute.js";

import technicianRoutes from "./routes/technicianRoute.js";
const app = express();

// Routes
app.use("/login", login);
app.use("/register", register);
app.use("/invitations", invitationRoutes);
app.use("/technicians", technicianRoutes);

// Equipment routes
app.use("/equipment", equipmentRoutes);
app.use("/stock", stockRoutes);
app.use("/stock-requests", stockRequestRoutes);
app.use("/allocations", allocationRoutes);
app.get("/", (req, res) => {
  res.send("Hospital Equipment Maintenance API Running");
});

// Add more routes here...



export default app; // ✅ default export for server.js
