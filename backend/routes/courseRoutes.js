const express = require("express");

const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");

const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// GET ALL COURSES
// GET /api/courses
//
// Logged-in users can view courses
// =====================================================

router.get(
  "/",
  authenticateToken,
  getAllCourses
);


// =====================================================
// GET COURSE BY ID
// GET /api/courses/:id
//
// Logged-in users can view one course
// =====================================================

router.get(
  "/:id",
  authenticateToken,
  getCourseById
);


// =====================================================
// CREATE COURSE
// POST /api/courses
//
// ADMIN ONLY
// =====================================================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createCourse
);


// =====================================================
// UPDATE COURSE
// PUT /api/courses/:id
//
// ADMIN ONLY
// =====================================================

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateCourse
);


// =====================================================
// DELETE COURSE
// DELETE /api/courses/:id
//
// ADMIN ONLY
// =====================================================

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteCourse
);


module.exports = router;