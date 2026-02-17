const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// -------- MongoDB Connection --------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🔥"))
  .catch(err => console.log("MongoDB connection error:", err));


// -------- Auth Routes --------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/equipment", require("./routes/equipment"));
app.use("/api/stock", require("./routes/stock"));
app.use("/api/task", require("./routes/task"));
app.use("/api/log", require("./routes/log"));
app.use("/api/invitation", require("./routes/invitation"));
app.use("/api/notification", require("./routes/notification"));
app.use("/api/report", require("./routes/report"));


// -------- Test Route --------
app.get("/", (req, res) => res.send("Backend is running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
