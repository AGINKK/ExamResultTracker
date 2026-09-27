const db = require("../config/db");

// GET ALL ATTENDANCE
const getAllAttendance = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        a.attendance_id,
        a.student_id,
        u.name AS student_name,
        a.subject_id,
        sub.subject_code,
        sub.subject_name,
        a.teacher_id,
        t_user.name AS teacher_name,
        a.attendance_date,
        a.status,
        a.created_at
      FROM attendance a
      LEFT JOIN students s
        ON a.student_id = s.student_id
      LEFT JOIN users u
        ON s.user_id = u.user_id
      LEFT JOIN subjects sub
        ON a.subject_id = sub.subject_id
      LEFT JOIN teachers t
        ON a.teacher_id = t.teacher_id
      LEFT JOIN users t_user
        ON t.user_id = t_user.user_id
      ORDER BY a.attendance_date DESC, a.attendance_id ASC
    `);

    res.status(200).json({
      success: true,
      message: "Attendance records retrieved successfully.",
      data: rows
    });

  } catch (error) {
    console.error("Get attendance error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve attendance records."
    });
  }
};


// GET ATTENDANCE BY ID
const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT
        a.attendance_id,
        a.student_id,
        u.name AS student_name,
        a.subject_id,
        sub.subject_code,
        sub.subject_name,
        a.teacher_id,
        t_user.name AS teacher_name,
        a.attendance_date,
        a.status,
        a.created_at
      FROM attendance a
      LEFT JOIN students s
        ON a.student_id = s.student_id
      LEFT JOIN users u
        ON s.user_id = u.user_id
      LEFT JOIN subjects sub
        ON a.subject_id = sub.subject_id
      LEFT JOIN teachers t
        ON a.teacher_id = t.teacher_id
      LEFT JOIN users t_user
        ON t.user_id = t_user.user_id
      WHERE a.attendance_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance record retrieved successfully.",
      data: rows[0]
    });

  } catch (error) {
    console.error("Get attendance error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve attendance record."
    });
  }
};


// CREATE ATTENDANCE
const createAttendance = async (req, res) => {
  try {
    const {
      attendance_id,
      student_id,
      subject_id,
      teacher_id,
      attendance_date,
      status
    } = req.body;

    if (
      !attendance_id ||
      !student_id ||
      !subject_id ||
      !teacher_id ||
      !attendance_date
    ) {
      return res.status(400).json({
        success: false,
        message: "All required attendance fields must be provided."
      });
    }

    // Check duplicate attendance ID
    const [existing] = await db.query(
      `SELECT attendance_id FROM attendance WHERE attendance_id = ?`,
      [attendance_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Attendance ID already exists."
      });
    }

    await db.query(
      `
      INSERT INTO attendance
      (
        attendance_id,
        student_id,
        subject_id,
        teacher_id,
        attendance_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        attendance_id,
        student_id,
        subject_id,
        teacher_id,
        attendance_date,
        status || "Present"
      ]
    );

    res.status(201).json({
      success: true,
      message: "Attendance record created successfully."
    });

  } catch (error) {
    console.error("Create attendance error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create attendance record."
    });
  }
};


// UPDATE ATTENDANCE
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      student_id,
      subject_id,
      teacher_id,
      attendance_date,
      status
    } = req.body;

    if (
      !student_id ||
      !subject_id ||
      !teacher_id ||
      !attendance_date ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "All required attendance fields must be provided."
      });
    }

    const [existing] = await db.query(
      `SELECT attendance_id FROM attendance WHERE attendance_id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found."
      });
    }

    await db.query(
      `
      UPDATE attendance
      SET
        student_id = ?,
        subject_id = ?,
        teacher_id = ?,
        attendance_date = ?,
        status = ?
      WHERE attendance_id = ?
      `,
      [
        student_id,
        subject_id,
        teacher_id,
        attendance_date,
        status,
        id
      ]
    );

    res.status(200).json({
      success: true,
      message: "Attendance record updated successfully."
    });

  } catch (error) {
    console.error("Update attendance error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update attendance record."
    });
  }
};


// DELETE ATTENDANCE
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      `SELECT attendance_id FROM attendance WHERE attendance_id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found."
      });
    }

    await db.query(
      `DELETE FROM attendance WHERE attendance_id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully."
    });

  } catch (error) {
    console.error("Delete attendance error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete attendance record."
    });
  }
};


module.exports = {
  getAllAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance
};