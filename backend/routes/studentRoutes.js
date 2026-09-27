const express = require("express");

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// GET /api/students
// Admin, Teacher and Student can view students
router.get(
  "/",
  authenticateToken,
  getAllStudents
);


// GET /api/students/:id
// Admin, Teacher and Student can view one student
router.get(
  "/:id",
  authenticateToken,
  getStudentById
);


// POST /api/students
// Admin only
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createStudent
);


// PUT /api/students/:id
// Admin only
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateStudent
);


// DELETE /api/students/:id
// Admin only
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteStudent
);


module.exports = router;