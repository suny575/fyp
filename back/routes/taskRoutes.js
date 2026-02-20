// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const { createTask } = require("../controllers/taskController");
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

// depStaff creates task
router.post("/", verifyToken, authorizeRole("depStaff"), createTask);

module.exports = router;
