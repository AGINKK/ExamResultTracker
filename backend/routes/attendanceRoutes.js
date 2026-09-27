const express = require("express");

const {
  getAllAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance
} = require("../controllers/attendanceController");

const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL ATTENDANCE
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  getAllAttendance
);

// GET ATTENDANCE BY ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  getAttendanceById
);

// CREATE ATTENDANCE
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createAttendance
);

// UPDATE ATTENDANCE
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateAttendance
);

// DELETE ATTENDANCE
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteAttendance
);

module.exports = router;