const db = require("../config/db");

// GET ALL SUBJECTS
const getAllSubjects = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        s.subject_id,
        s.subject_code,
        s.subject_name,
        s.course_id,
        c.course_name,
        s.semester,
        s.credits,
        s.status,
        s.created_at
      FROM subjects s
      LEFT JOIN courses c
        ON s.course_id = c.course_id
      ORDER BY s.subject_id ASC
    `);

    res.status(200).json({
      success: true,
      message: "Subjects retrieved successfully.",
      data: rows
    });

  } catch (error) {
    console.error("Get subjects error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve subjects."
    });
  }
};


// GET SUBJECT BY ID
const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT
        s.subject_id,
        s.subject_code,
        s.subject_name,
        s.course_id,
        c.course_name,
        s.semester,
        s.credits,
        s.status,
        s.created_at
      FROM subjects s
      LEFT JOIN courses c
        ON s.course_id = c.course_id
      WHERE s.subject_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subject not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject retrieved successfully.",
      data: rows[0]
    });

  } catch (error) {
    console.error("Get subject error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve subject."
    });
  }
};


// CREATE SUBJECT
const createSubject = async (req, res) => {
  try {
    const {
      subject_id,
      subject_code,
      subject_name,
      course_id,
      semester,
      credits,
      status
    } = req.body;

    if (
      !subject_id ||
      !subject_code ||
      !subject_name ||
      !course_id ||
      !semester ||
      !credits
    ) {
      return res.status(400).json({
        success: false,
        message: "All required subject fields must be provided."
      });
    }

    const [existing] = await db.query(
      `SELECT subject_id FROM subjects WHERE subject_id = ?`,
      [subject_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Subject ID already exists."
      });
    }

    const [existingCode] = await db.query(
      `SELECT subject_code FROM subjects WHERE subject_code = ?`,
      [subject_code]
    );

    if (existingCode.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Subject code already exists."
      });
    }

    await db.query(
      `
      INSERT INTO subjects
      (
        subject_id,
        subject_code,
        subject_name,
        course_id,
        semester,
        credits,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        subject_id,
        subject_code,
        subject_name,
        course_id,
        semester,
        credits,
        status || "active"
      ]
    );

    res.status(201).json({
      success: true,
      message: "Subject created successfully."
    });

  } catch (error) {
    console.error("Create subject error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create subject."
    });
  }
};


// UPDATE SUBJECT
const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      subject_code,
      subject_name,
      course_id,
      semester,
      credits,
      status
    } = req.body;

    if (
      !subject_code ||
      !subject_name ||
      !course_id ||
      !semester ||
      !credits
    ) {
      return res.status(400).json({
        success: false,
        message: "All required subject fields must be provided."
      });
    }

    const [existing] = await db.query(
      `SELECT subject_id FROM subjects WHERE subject_id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subject not found."
      });
    }

    await db.query(
      `
      UPDATE subjects
      SET
        subject_code = ?,
        subject_name = ?,
        course_id = ?,
        semester = ?,
        credits = ?,
        status = ?
      WHERE subject_id = ?
      `,
      [
        subject_code,
        subject_name,
        course_id,
        semester,
        credits,
        status || "active",
        id
      ]
    );

    res.status(200).json({
      success: true,
      message: "Subject updated successfully."
    });

  } catch (error) {
    console.error("Update subject error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update subject."
    });
  }
};


// DELETE SUBJECT
const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      `SELECT subject_id FROM subjects WHERE subject_id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Subject not found."
      });
    }

    await db.query(
      `DELETE FROM subjects WHERE subject_id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully."
    });

  } catch (error) {
    console.error("Delete subject error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete subject."
    });
  }
};


module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
};