const express = require("express");

const {
  getAllUsers,
  getUserById,
  getMyProfile,
  updateMyProfile
} = require("../controllers/userController");

const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// CURRENT LOGGED-IN USER PROFILE
// =====================================================

router.get(
  "/me",
  authenticateToken,
  authorizeRoles("admin"),
  getMyProfile
);


// =====================================================
// UPDATE CURRENT LOGGED-IN USER PROFILE
// =====================================================

router.put(
  "/me",
  authenticateToken,
  authorizeRoles("admin"),
  updateMyProfile
);


// =====================================================
// GET ALL USERS
// =====================================================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  getAllUsers
);


// =====================================================
// GET USER BY ID
// =====================================================

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  getUserById
);


module.exports = router;