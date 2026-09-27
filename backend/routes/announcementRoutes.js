const express = require("express");

const {
  getAllAnnouncements,
  getAnnouncementById,
  getTeacherAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require("../controllers/announcementController");

const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// TEACHER ANNOUNCEMENTS
// =====================================================

router.get(
  "/teacher",
  authenticateToken,
  authorizeRoles("teacher"),
  getTeacherAnnouncements
);


// =====================================================
// ADMIN - GET ALL ANNOUNCEMENTS
// =====================================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  getAllAnnouncements
);


// =====================================================
// ADMIN - GET ANNOUNCEMENT BY ID
// =====================================================

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  getAnnouncementById
);


// =====================================================
// ADMIN - CREATE ANNOUNCEMENT
// =====================================================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createAnnouncement
);


// =====================================================
// ADMIN - UPDATE ANNOUNCEMENT
// =====================================================

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateAnnouncement
);


// =====================================================
// ADMIN - DELETE ANNOUNCEMENT
// =====================================================

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteAnnouncement
);


module.exports = router;