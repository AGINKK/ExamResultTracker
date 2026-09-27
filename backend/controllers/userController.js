const db = require("../config/db");


// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        user_id,
        name,
        email,
        role,
        status,
        created_at
      FROM users
      ORDER BY user_id ASC
    `);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      data: rows
    });

  } catch (error) {
    console.error("Get users error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve users."
    });
  }
};


// =====================================================
// GET USER BY ID
// =====================================================

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT
        user_id,
        name,
        email,
        role,
        status,
        created_at
      FROM users
      WHERE user_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully.",
      data: rows[0]
    });

  } catch (error) {
    console.error("Get user error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve user."
    });
  }
};


// =====================================================
// GET CURRENT LOGGED-IN USER PROFILE
// =====================================================

const getMyProfile = async (req, res) => {
  try {
    // user_id comes from the verified JWT
    const userId = req.user.user_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User information is missing from authentication token."
      });
    }

    const [rows] = await db.query(`
      SELECT
        user_id,
        name,
        email,
        role,
        status,
        created_at
      FROM users
      WHERE user_id = ?
    `, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User profile not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully.",
      data: rows[0]
    });

  } catch (error) {
    console.error("Get my profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile."
    });
  }
};


// =====================================================
// UPDATE CURRENT LOGGED-IN USER PROFILE
// =====================================================

const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const {
      name,
      email
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required."
      });
    }

    // Check whether another user already uses this email
    const [existing] = await db.query(
      `
      SELECT user_id
      FROM users
      WHERE email = ?
      AND user_id != ?
      `,
      [email, userId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email address is already in use."
      });
    }

    await db.query(
      `
      UPDATE users
      SET
        name = ?,
        email = ?
      WHERE user_id = ?
      `,
      [
        name,
        email,
        userId
      ]
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully."
    });

  } catch (error) {
    console.error("Update my profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update profile."
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAllUsers,
  getUserById,
  getMyProfile,
  updateMyProfile
};