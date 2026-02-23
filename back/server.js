require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

connectDB();

// const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store connected users
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
  });

  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }
  });
});

app.set("io", io);
app.set("onlineUsers", onlineUsers);
server.listen(5000, () => console.log("Server running"));

const equipmentRoutes = require("./routes/equipmentRoutes");
app.use("/api/equipment", equipmentRoutes);

const qrApprovalRoutes = require("./routes/qrApprovalRoutes");
app.use("/api/qr-approval", qrApprovalRoutes);
