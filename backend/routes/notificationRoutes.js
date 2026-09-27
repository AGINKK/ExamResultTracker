const express = require("express");

const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
} = require("../controllers/notificationController");

const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL NOTIFICATIONS
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  getAllNotifications
);

// GET NOTIFICATION BY ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  getNotificationById
);

// CREATE NOTIFICATION
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  createNotification
);

// UPDATE NOTIFICATION
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  updateNotification
);

// DELETE NOTIFICATION
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  deleteNotification
);

module.exports = router;