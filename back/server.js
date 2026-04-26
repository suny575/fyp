// server.js

import "dotenv/config";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import appRoutes from "./app.js";
import { startMaintenanceScheduler } from "./schedulers/maintenanceScheduler.js";
import { getAdminSettings } from "./services/adminSettingsService.js";
import { setIo } from "./services/socket.service.js";

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultFrontendOrigin = "https://fyp-indol-one.vercel.app";
const frontendOrigin = process.env.FRONTEND_URL
  ? new URL(process.env.FRONTEND_URL).origin
  : defaultFrontendOrigin;
const allowedOrigins = [frontendOrigin];

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    return new URL(origin).hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

connectDB();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});

// ===== ROUTES =====
app.use("/api", appRoutes);
const server = http.createServer(app);

let io;

io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setIo(io);

let onlineUsers = {};

io.on("connection", (socket) => {

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

// ========= Crash handling (honors autoRestart setting) =========
const handleFatal = async (err) => {
  console.error("Fatal error caught:", err);
  try {
    const settings = await getAdminSettings();
    if (settings?.autoRestart) {
      console.error("autoRestart enabled -> exiting for PM2 to restart");
      process.exit(1);
    } else {
      console.error("autoRestart disabled -> keeping process alive");
    }
  } catch (e) {
    console.error("Failed to read admin settings during crash handling:", e);
    // safest default: stay up
  }
};

process.on("uncaughtException", handleFatal);
process.on("unhandledRejection", handleFatal);

