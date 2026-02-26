import express from "express";
import login from "./routes/login.js";
import register from "./routes/register.js";
import invitationRoutes from "./routes/invitationRoute.js";
import technicianRoutes from "./routes/technicianRoute.js";
import depStaffRoute from "./routes/depStaffRoute.js";
import faultRoutes from "./routes/faultRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
const app = express();

// Routes
app.use("/login", login);
app.use("/register", register);
app.use("/manager", managerRoutes);
app.use("/invitations", invitationRoutes);
app.use("/technicians", technicianRoutes);
app.use("/depstaff", depStaffRoute);
app.use("/faults", faultRoutes);

app.get("/", (req, res) => {
  res.send("Hospital Equipment Maintenance API Running");
});

// Add more routes here...

export default app;
