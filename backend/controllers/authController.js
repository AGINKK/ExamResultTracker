const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    // Find user
    const [users] = await db.query(
      "SELECT user_id, name, email, password, role, status FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const user = users[0];

    // Check account status
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "This account is inactive."
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );

    // Remove password before sending response
    delete user.password;

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user
    });

  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error during login."
    });
  }
};

module.exports = {
  login
};