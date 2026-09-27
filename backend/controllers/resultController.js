const db = require("../config/db");

// =====================================================
// GET ALL RESULTS
// ADMIN ONLY
// =====================================================

const getAllResults = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        r.result_id,

        r.student_id,
        s.student_id AS student_code,
        u.name AS student_name,

        r.exam_id,
        e.exam_name,

        r.subject_id,
        sub.subject_code,
        sub.subject_name,

        c.course_id,
        c.course_name,

        r.marks_obtained,
        r.max_marks,
        r.grade,
        r.status,
        r.created_at

      FROM results r

      LEFT JOIN students s
        ON r.student_id = s.student_id

      LEFT JOIN users u
        ON s.user_id = u.user_id

      LEFT JOIN exams e
        ON r.exam_id = e.exam_id

      LEFT JOIN subjects sub
        ON r.subject_id = sub.subject_id

      LEFT JOIN courses c
        ON s.course_id = c.course_id

      ORDER BY r.result_id ASC
    `);

    res.status(200).json({
      success: true,
      message: "Results retrieved successfully.",
      data: rows
    });

  } catch (error) {
    console.error(
      "Get results error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve results."
    });
  }
};


// =====================================================
// GET RESULT BY ID
// ADMIN ONLY
// =====================================================

const getResultById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(`
      SELECT
        r.result_id,

        r.student_id,
        s.student_id AS student_code,
        u.name AS student_name,

        r.exam_id,
        e.exam_name,

        r.subject_id,
        sub.subject_code,
        sub.subject_name,

        c.course_id,
        c.course_name,

        r.marks_obtained,
        r.max_marks,
        r.grade,
        r.status,
        r.created_at

      FROM results r

      LEFT JOIN students s
        ON r.student_id = s.student_id

      LEFT JOIN users u
        ON s.user_id = u.user_id

      LEFT JOIN exams e
        ON r.exam_id = e.exam_id

      LEFT JOIN subjects sub
        ON r.subject_id = sub.subject_id

      LEFT JOIN courses c
        ON s.course_id = c.course_id

      WHERE r.result_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Result not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Result retrieved successfully.",
      data: rows[0]
    });

  } catch (error) {
    console.error(
      "Get result error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve result."
    });
  }
};

// =====================================================
// GET RESULTS FOR CURRENT TEACHER
// TEACHER ONLY
// =====================================================

const getTeacherResults = async (req, res) => {
  try {
    const userId = req.user.user_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User information is missing from authentication token."
      });
    }

    // -------------------------------------------------
    // Verify teacher profile
    // -------------------------------------------------

    const [teacherRows] = await db.query(
      `
      SELECT
        teacher_id
      FROM teachers
      WHERE user_id = ?
      `,
      [userId]
    );

    if (teacherRows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Teacher profile not found."
      });
    }

    // -------------------------------------------------
    // Load result records
    //
    // NOTE:
    // Current results table does not contain teacher_id.
    // Therefore this query uses the existing result
    // structure without changing the Admin module.
    // -------------------------------------------------

    const [rows] = await db.query(
      `
      SELECT
        r.result_id,

        r.student_id,
        s.student_id AS student_code,
        u.name AS student_name,

        r.exam_id,
        e.exam_name,

        r.subject_id,
        sub.subject_code,
        sub.subject_name,

        c.course_id,
        c.course_name,

        r.marks_obtained,
        r.max_marks,
        r.grade,
        r.status,
        r.created_at

      FROM results r

      LEFT JOIN students s
        ON r.student_id = s.student_id

      LEFT JOIN users u
        ON s.user_id = u.user_id

      LEFT JOIN exams e
        ON r.exam_id = e.exam_id

      LEFT JOIN subjects sub
        ON r.subject_id = sub.subject_id

      LEFT JOIN courses c
        ON s.course_id = c.course_id

      ORDER BY
        e.exam_name ASC,
        sub.subject_code ASC,
        s.student_id ASC
      `
    );

    return res.status(200).json({
      success: true,
      message:
        "Teacher results retrieved successfully.",
      data: rows
    });

  } catch (error) {
    console.error(
      "Get teacher results error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve teacher results."
    });
  }
};


// =====================================================
// CREATE RESULT
// ADMIN ONLY
// =====================================================

const createResult = async (req, res) => {
  try {
    const {
      result_id,
      student_id,
      exam_id,
      subject_id,
      marks_obtained,
      max_marks,
      grade,
      status
    } = req.body;

    if (
      !result_id ||
      !student_id ||
      !exam_id ||
      !subject_id ||
      marks_obtained === undefined ||
      marks_obtained === null ||
      max_marks === undefined ||
      max_marks === null ||
      !grade
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required result fields must be provided."
      });
    }

    const [existing] = await db.query(
      `
      SELECT result_id
      FROM results
      WHERE result_id = ?
      `,
      [result_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Result ID already exists."
      });
    }

    await db.query(
      `
      INSERT INTO results
      (
        result_id,
        student_id,
        exam_id,
        subject_id,
        marks_obtained,
        max_marks,
        grade,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        result_id,
        student_id,
        exam_id,
        subject_id,
        marks_obtained,
        max_marks,
        grade,
        status || "Pass"
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Result created successfully."
    });

  } catch (error) {
    console.error(
      "Create result error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create result."
    });
  }
};


// =====================================================
// UPDATE RESULT
// ADMIN ONLY
// =====================================================

const updateResult = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      student_id,
      exam_id,
      subject_id,
      marks_obtained,
      max_marks,
      grade,
      status
    } = req.body;

    if (
      !student_id ||
      !exam_id ||
      !subject_id ||
      marks_obtained === undefined ||
      marks_obtained === null ||
      max_marks === undefined ||
      max_marks === null ||
      !grade
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required result fields must be provided."
      });
    }

    const [existing] = await db.query(
      `
      SELECT result_id
      FROM results
      WHERE result_id = ?
      `,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Result not found."
      });
    }

    await db.query(
      `
      UPDATE results
      SET
        student_id = ?,
        exam_id = ?,
        subject_id = ?,
        marks_obtained = ?,
        max_marks = ?,
        grade = ?,
        status = ?
      WHERE result_id = ?
      `,
      [
        student_id,
        exam_id,
        subject_id,
        marks_obtained,
        max_marks,
        grade,
        status || "Pass",
        id
      ]
    );

    res.status(200).json({
      success: true,
      message:
        "Result updated successfully."
    });

  } catch (error) {
    console.error(
      "Update result error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update result."
    });
  }
};

// =====================================================
// UPDATE RESULT BY TEACHER
// TEACHER ONLY
// =====================================================

const updateTeacherResult = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { marks_obtained } = req.body;

    // -------------------------------------------------
    // VERIFY AUTHENTICATED USER
    // -------------------------------------------------

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User information is missing from authentication token."
      });
    }

    // -------------------------------------------------
    // VERIFY TEACHER
    // -------------------------------------------------

    const [teacherRows] = await db.query(
      `
      SELECT
        teacher_id
      FROM teachers
      WHERE user_id = ?
      `,
      [userId]
    );

    if (teacherRows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Teacher profile not found."
      });
    }

    // -------------------------------------------------
    // VALIDATE RESULT ID
    // -------------------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Result ID is required."
      });
    }

    // -------------------------------------------------
    // VALIDATE MARKS
    // -------------------------------------------------

    if (
      marks_obtained === undefined ||
      marks_obtained === null ||
      marks_obtained === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Marks obtained is required."
      });
    }

    const marks = Number(marks_obtained);

    if (
      Number.isNaN(marks) ||
      !Number.isFinite(marks) ||
      marks < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Marks must be a valid non-negative number."
      });
    }

    // -------------------------------------------------
    // GET EXISTING RESULT
    // -------------------------------------------------

    const [resultRows] = await db.query(
      `
      SELECT
        result_id,
        max_marks
      FROM results
      WHERE result_id = ?
      `,
      [id]
    );

    if (resultRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Result not found."
      });
    }

    const maxMarks = Number(
      resultRows[0].max_marks
    );

    if (
      Number.isNaN(maxMarks) ||
      maxMarks <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid maximum marks configured for this result."
      });
    }

    // -------------------------------------------------
    // MARKS LIMIT
    // -------------------------------------------------

    if (marks > maxMarks) {
      return res.status(400).json({
        success: false,
        message:
          `Marks cannot be greater than ${maxMarks}.`
      });
    }

    // -------------------------------------------------
    // CALCULATE PERCENTAGE
    // -------------------------------------------------

    const percentage =
      (marks / maxMarks) * 100;

    // -------------------------------------------------
    // CALCULATE GRADE
    // -------------------------------------------------

    let grade;

    if (percentage >= 90) {
      grade = "A+";
    } else if (percentage >= 80) {
      grade = "A";
    } else if (percentage >= 70) {
      grade = "B+";
    } else if (percentage >= 60) {
      grade = "B";
    } else if (percentage >= 50) {
      grade = "C";
    } else if (percentage >= 40) {
      grade = "D";
    } else {
      grade = "F";
    }

    // -------------------------------------------------
    // CALCULATE STATUS
    // -------------------------------------------------

    const status =
      percentage >= 40
        ? "Pass"
        : "Fail";

    // -------------------------------------------------
    // UPDATE RESULT
    // -------------------------------------------------

    await db.query(
      `
      UPDATE results
      SET
        marks_obtained = ?,
        grade = ?,
        status = ?
      WHERE result_id = ?
      `,
      [
        marks,
        grade,
        status,
        id
      ]
    );

    return res.status(200).json({
      success: true,
      message:
        "Result updated successfully.",
      data: {
        result_id: id,
        marks_obtained: marks,
        max_marks: maxMarks,
        grade,
        status
      }
    });

  } catch (error) {
    console.error(
      "Teacher update result error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update result."
    });
  }
};

// =====================================================
// DELETE RESULT
// ADMIN ONLY
// =====================================================

const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query(
      `
      SELECT result_id
      FROM results
      WHERE result_id = ?
      `,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Result not found."
      });
    }

    await db.query(
      `
      DELETE FROM results
      WHERE result_id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message:
        "Result deleted successfully."
    });

  } catch (error) {
    console.error(
      "Delete result error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete result."
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getAllResults,
  getResultById,
  getTeacherResults,
  createResult,
  updateResult,
  updateTeacherResult,
  deleteResult
};