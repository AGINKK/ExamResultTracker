const express = require("express");

const {
  getAllTeachers,
  getTeacherById,
  getMyTeacherProfile,
  updateMyTeacherProfile,
  getMyTeacherDashboard,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require("../controllers/teacherController");

const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// TEACHER DASHBOARD
// =====================================================

router.get(
  "/me/dashboard",
  authenticateToken,
  authorizeRoles("teacher"),
  getMyTeacherDashboard
);


// =====================================================
// TEACHER - CURRENT PROFILE
// =====================================================

router.get(
  "/me/profile",
  authenticateToken,
  authorizeRoles("teacher"),
  getMyTeacherProfile
);


// =====================================================
// TEACHER - UPDATE CURRENT PROFILE
// =====================================================

router.put(
  "/me/profile",
  authenticateToken,
  authorizeRoles("teacher"),
  updateMyTeacherProfile
);


// =====================================================
// ADMIN - GET ALL TEACHERS
// =====================================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  getAllTeachers
);


// =====================================================
// ADMIN - GET TEACHER BY ID
// =====================================================

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  getTeacherById
);


// =====================================================
// ADMIN - CREATE TEACHER
// =====================================================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createTeacher
);


// =====================================================
// ADMIN - UPDATE TEACHER
// =====================================================

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateTeacher
);


// =====================================================
// ADMIN - DELETE TEACHER
// =====================================================

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteTeacher
);


module.exports = router;