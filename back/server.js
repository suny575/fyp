// server.js

import "dotenv/config";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import appRoutes from "./app.js";
import { startMaintenanceScheduler } from "./schedulers/maintenanceScheduler.js";

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ===== ROUTES =====
app.use("/api", appRoutes);

// ===== SOCKET.IO =====
const server = http.createServer(app);

// declare first (important)
let io;

io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
   console.log(process.env.MONGO_URI);

  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
  });

  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) delete onlineUsers[userId];
    }
  });

  socket.on("join", (userId) => {
    socket.join(userId); // each user gets their private room
  });
});

// Make Socket.IO accessible in routes if needed
app.set("io", io);
app.set("onlineUsers", onlineUsers);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startMaintenanceScheduler();
});

// exports
export { io, server };
export default io;
