const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");

const {
  authenticateToken,
  authorizeRoles
} = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Route
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);


// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Exam Result Tracker Backend is running successfully!"
  });
});

// Database test route
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS result");

    res.json({
      success: true,
      message: "MySQL database connected successfully!",
      data: rows
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed."
    });
  }
});

// Protected test route
app.get(
  "/api/protected",
  authenticateToken,
  (req, res) => {
    res.json({
      success: true,
      message: "You accessed a protected route.",
      user: req.user
    });
  }
);

// Admin-only test route
app.get(
  "/api/admin-test",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin access granted.",
      user: req.user
    });
  }
);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    await db.query("SELECT 1");
    console.log("MySQL database connection verified.");
  } catch (error) {
    console.error("MySQL database connection failed:", error.message);
  }
});