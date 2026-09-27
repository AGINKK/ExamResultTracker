const db = require("../config/db");

// GET ALL EXAMS
const getAllExams = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        exam_id,
        exam_name,
        course_id,
        semester,
        academic_year,
        exam_date,
        status,
        created_at
      FROM exams
      ORDER BY exam_id ASC
    `);

    res.status(200).json({
      success: true,
      message: "Exams retrieved successfully.",
      data: rows
    });

  } catch (error) {
    console.error("Get exams error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve exams."
    });
  }
};


// GET EXAM BY ID
const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT
        exam_id,
        exam_name,
        course_id,
        semester,
        academic_year,
        exam_date,
        status,
        created_at
      FROM exams
      WHERE exam_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam retrieved successfully.",
      data: rows[0]
    });

  } catch (error) {
    console.error("Get exam error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve exam."
    });
  }
};


// CREATE EXAM
const createExam = async (req, res) => {
  try {
    const {
      exam_id,
      exam_name,
      course_id,
      semester,
      academic_year,
      exam_date,
      status
    } = req.body;

    if (
      !exam_id ||
      !exam_name ||
      !course_id ||
      !semester ||
      !academic_year ||
      !exam_date
    ) {
      return res.status(400).json({
        success: false,
        message: "All required exam fields must be provided."
      });
    }

    // Check duplicate Exam ID
    const [existing] = await db.query(
      `SELECT exam_id FROM exams WHERE exam_id = ?`,
      [exam_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Exam ID already exists."
      });
    }

    await db.query(
      `
      INSERT INTO exams
      (
        exam_id,
        exam_name,
        course_id,
        semester,
        academic_year,
        exam_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        exam_id,
        exam_name,
        course_id,
        semester,
        academic_year,
        exam_date,
        status || "scheduled"
      ]
    );

    res.status(201).json({
      success: true,
      message: "Exam created successfully."
    });

  } catch (error) {
    console.error("Create exam error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create exam."
    });
  }
};


// UPDATE EXAM
const updateExam = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      exam_name,
      course_id,
      semester,
      academic_year,
      exam_date,
      status
    } = req.body;

    if (
      !exam_name ||
      !course_id ||
      !semester ||
      !academic_year ||
      !exam_date
    ) {
      return res.status(400).json({
        success: false,
        message: "All required exam fields must be provided."
      });
    }

    const [existing] = await db.query(
      `SELECT exam_id FROM exams WHERE exam_id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });
    }

    await db.query(
      `
      UPDATE exams
      SET
        exam_name = ?,
        course_id = ?,
        semester = ?,
        academic_year = ?,
        exam_date = ?,
        status = ?
      WHERE exam_id = ?
      `,
      [
        exam_name,
        course_id,
        semester,
        academic_year,
        exam_date,
        status || "scheduled",
        id
      ]
    );

    res.status(200).json({
      success: true,
      message: "Exam updated successfully."
    });

  } catch (error) {
    console.error("Update exam error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update exam."
    });
  }
};


// DELETE EXAM
const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      `SELECT exam_id FROM exams WHERE exam_id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Exam not found."
      });
    }

    await db.query(
      `DELETE FROM exams WHERE exam_id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Exam deleted successfully."
    });

  } catch (error) {
    console.error("Delete exam error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete exam."
    });
  }
};


module.exports = {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam
};