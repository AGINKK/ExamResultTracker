const db = require("../config/db");

// GET ALL NOTIFICATIONS
const getAllNotifications = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        n.notification_id,
        n.user_id,
        u.name AS user_name,
        n.title,
        n.message,
        n.type,
        n.is_read,
        n.created_at
      FROM notifications n
      LEFT JOIN users u
        ON n.user_id = u.user_id
      ORDER BY n.created_at DESC
    `);

    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully.",
      data: rows
    });

  } catch (error) {
    console.error("Get notifications error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications."
    });
  }
};


// GET NOTIFICATION BY ID
const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT
        n.notification_id,
        n.user_id,
        u.name AS user_name,
        n.title,
        n.message,
        n.type,
        n.is_read,
        n.created_at
      FROM notifications n
      LEFT JOIN users u
        ON n.user_id = u.user_id
      WHERE n.notification_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification retrieved successfully.",
      data: rows[0]
    });

  } catch (error) {
    console.error("Get notification error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve notification."
    });
  }
};


// CREATE NOTIFICATION
const createNotification = async (req, res) => {
  try {
    const {
      notification_id,
      user_id,
      title,
      message,
      type,
      is_read
    } = req.body;

    if (
      !notification_id ||
      !user_id ||
      !title ||
      !message ||
      !type
    ) {
      return res.status(400).json({
        success: false,
        message: "All required notification fields must be provided."
      });
    }

    const [existing] = await db.query(
      `SELECT notification_id FROM notifications WHERE notification_id = ?`,
      [notification_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Notification ID already exists."
      });
    }

    await db.query(
      `
      INSERT INTO notifications
      (
        notification_id,
        user_id,
        title,
        message,
        type,
        is_read
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        notification_id,
        user_id,
        title,
        message,
        type,
        is_read !== undefined ? is_read : 0
      ]
    );

    res.status(201).json({
      success: true,
      message: "Notification created successfully."
    });

  } catch (error) {
    console.error("Create notification error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create notification."
    });
  }
};


// UPDATE NOTIFICATION
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      user_id,
      title,
      message,
      type,
      is_read
    } = req.body;

    if (
      !user_id ||
      !title ||
      !message ||
      !type ||
      is_read === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required notification fields must be provided."
      });
    }

    const [existing] = await db.query(
      `SELECT notification_id FROM notifications WHERE notification_id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found."
      });
    }

    await db.query(
      `
      UPDATE notifications
      SET
        user_id = ?,
        title = ?,
        message = ?,
        type = ?,
        is_read = ?
      WHERE notification_id = ?
      `,
      [
        user_id,
        title,
        message,
        type,
        is_read,
        id
      ]
    );

    res.status(200).json({
      success: true,
      message: "Notification updated successfully."
    });

  } catch (error) {
    console.error("Update notification error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update notification."
    });
  }
};


// DELETE NOTIFICATION
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      `SELECT notification_id FROM notifications WHERE notification_id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found."
      });
    }

    await db.query(
      `DELETE FROM notifications WHERE notification_id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully."
    });

  } catch (error) {
    console.error("Delete notification error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete notification."
    });
  }
};


module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
};