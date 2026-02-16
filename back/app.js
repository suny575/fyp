const express = require("express");

const app = express();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hospital Equipment Maintenance API Running");
});

module.exports = app;
