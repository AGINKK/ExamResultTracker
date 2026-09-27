const express = require("express");

const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} = require("../controllers/subjectController");

const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL SUBJECTS
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  getAllSubjects
);

// GET SUBJECT BY ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  getSubjectById
);

// CREATE SUBJECT
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createSubject
);

// UPDATE SUBJECT
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateSubject
);

// DELETE SUBJECT
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteSubject
);

module.exports = router;