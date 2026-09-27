const db = require("../config/db");


// =====================================================
// GET ALL ANNOUNCEMENTS
// ADMIN ONLY
// =====================================================

const getAllAnnouncements = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        announcement_id,
        title,
        category,
        message,
        published_date,
        created_at
      FROM announcements
      ORDER BY published_date DESC, announcement_id DESC
    `);

    res.status(200).json({
      success: true,
      message: "Announcements retrieved successfully.",
      data: rows
    });

  } catch (error) {

    console.error(
      "Get announcements error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve announcements."
    });

  }
};



// =====================================================
// GET ANNOUNCEMENT BY ID
// ADMIN ONLY
// =====================================================

const getAnnouncementById = async (req, res) => {
  try {

    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        announcement_id,
        title,
        category,
        message,
        published_date,
        created_at
      FROM announcements
      WHERE announcement_id = ?
      `,
      [id]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Announcement not found."
      });

    }

    res.status(200).json({
      success: true,
      message: "Announcement retrieved successfully.",
      data: rows[0]
    });

  } catch (error) {

    console.error(
      "Get announcement error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve announcement."
    });

  }
};



// =====================================================
// GET ANNOUNCEMENTS FOR TEACHER
// TEACHER ONLY
// =====================================================

const getTeacherAnnouncements = async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT
        announcement_id,
        title,
        category,
        message,
        published_date,
        created_at
      FROM announcements
      WHERE published_date IS NOT NULL
        AND published_date <= NOW()
      ORDER BY published_date DESC, announcement_id DESC
    `);

    res.status(200).json({
      success: true,
      message: "Teacher announcements retrieved successfully.",
      data: rows
    });

  } catch (error) {

    console.error(
      "Get teacher announcements error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve teacher announcements."
    });

  }
};



// =====================================================
// CREATE ANNOUNCEMENT
// ADMIN ONLY
// =====================================================

const createAnnouncement = async (req, res) => {
  try {

    const {
      announcement_id,
      title,
      category,
      message,
      published_date
    } = req.body;


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !announcement_id ||
      !title ||
      !category ||
      !message
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Announcement ID, title, category and message are required."
      });

    }


    // -------------------------------------------------
    // CHECK ANNOUNCEMENT ID
    // -------------------------------------------------

    const [existing] = await db.query(
      `
      SELECT announcement_id
      FROM announcements
      WHERE announcement_id = ?
      `,
      [announcement_id]
    );

    if (existing.length > 0) {

      return res.status(409).json({
        success: false,
        message: "Announcement ID already exists."
      });

    }


    // -------------------------------------------------
    // INSERT
    // -------------------------------------------------

    await db.query(
      `
      INSERT INTO announcements
      (
        announcement_id,
        title,
        category,
        message,
        published_date
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        announcement_id,
        title.trim(),
        category.trim(),
        message.trim(),
        published_date || new Date()
      ]
    );


    res.status(201).json({
      success: true,
      message: "Announcement created successfully."
    });

  } catch (error) {

    console.error(
      "Create announcement error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create announcement."
    });

  }
};



// =====================================================
// UPDATE ANNOUNCEMENT
// ADMIN ONLY
// =====================================================

const updateAnnouncement = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      category,
      message,
      published_date
    } = req.body;


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !title ||
      !category ||
      !message
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Title, category and message are required."
      });

    }


    // -------------------------------------------------
    // CHECK EXISTING ANNOUNCEMENT
    // -------------------------------------------------

    const [existing] = await db.query(
      `
      SELECT announcement_id
      FROM announcements
      WHERE announcement_id = ?
      `,
      [id]
    );

    if (existing.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Announcement not found."
      });

    }


    // -------------------------------------------------
    // UPDATE
    // -------------------------------------------------

    await db.query(
      `
      UPDATE announcements
      SET
        title = ?,
        category = ?,
        message = ?,
        published_date = ?
      WHERE announcement_id = ?
      `,
      [
        title.trim(),
        category.trim(),
        message.trim(),
        published_date || new Date(),
        id
      ]
    );


    res.status(200).json({
      success: true,
      message: "Announcement updated successfully."
    });

  } catch (error) {

    console.error(
      "Update announcement error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to update announcement."
    });

  }
};



// =====================================================
// DELETE ANNOUNCEMENT
// ADMIN ONLY
// =====================================================

const deleteAnnouncement = async (req, res) => {
  try {

    const { id } = req.params;


    // -------------------------------------------------
    // CHECK EXISTING ANNOUNCEMENT
    // -------------------------------------------------

    const [existing] = await db.query(
      `
      SELECT announcement_id
      FROM announcements
      WHERE announcement_id = ?
      `,
      [id]
    );

    if (existing.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Announcement not found."
      });

    }


    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    await db.query(
      `
      DELETE FROM announcements
      WHERE announcement_id = ?
      `,
      [id]
    );


    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully."
    });

  } catch (error) {

    console.error(
      "Delete announcement error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete announcement."
    });

  }
};



// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  getTeacherAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};