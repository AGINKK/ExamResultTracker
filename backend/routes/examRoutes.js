const express = require("express");

const {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam
} = require("../controllers/examController");

const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL EXAMS
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  getAllExams
);

// GET EXAM BY ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  getExamById
);

// CREATE EXAM
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createExam
);

// UPDATE EXAM
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateExam
);

// DELETE EXAM
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteExam
);

module.exports = router;