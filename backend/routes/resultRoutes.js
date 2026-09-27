const express = require("express");

const {
  getAllResults,
  getResultById,
  getTeacherResults,
  createResult,
  updateResult,
  updateTeacherResult,
  deleteResult
} = require("../controllers/resultController");

const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// ADMIN - GET ALL RESULTS
// =====================================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  getAllResults
);


// =====================================================
// TEACHER - GET RESULTS
// =====================================================

router.get(
  "/teacher/my-results",
  authenticateToken,
  authorizeRoles("teacher"),
  getTeacherResults
);


// =====================================================
// TEACHER - UPDATE RESULT
// =====================================================

router.put(
  "/teacher/:id",
  authenticateToken,
  authorizeRoles("teacher"),
  updateTeacherResult
);


// =====================================================
// ADMIN - GET RESULT BY ID
// =====================================================

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  getResultById
);


// =====================================================
// ADMIN - CREATE RESULT
// =====================================================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createResult
);


// =====================================================
// ADMIN - UPDATE RESULT
// =====================================================

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateResult
);


// =====================================================
// ADMIN - DELETE RESULT
// =====================================================

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteResult
);


module.exports = router;