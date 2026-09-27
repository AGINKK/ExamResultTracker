const db = require("../config/db");
const bcrypt = require("bcryptjs");

// =====================================================
// GET ALL TEACHERS
// ADMIN ONLY
// =====================================================

const getAllTeachers = async (req, res) => {
  try {
    const [teachers] = await db.query(`
      SELECT
        t.teacher_id,
        t.user_id,
        u.name,
        u.email,
        u.status,
        t.department,
        t.designation,
        t.created_at
      FROM teachers t
      JOIN users u ON t.user_id = u.user_id
      ORDER BY t.teacher_id
    `);

    res.json({
      success: true,
      count: teachers.length,
      data: teachers
    });

  } catch (error) {
    console.error("Get teachers error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve teachers."
    });
  }
};


// =====================================================
// GET TEACHER BY ID
// ADMIN ONLY
// =====================================================

const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const [teachers] = await db.query(`
      SELECT
        t.teacher_id,
        t.user_id,
        u.name,
        u.email,
        u.status,
        t.department,
        t.designation,
        t.created_at
      FROM teachers t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.teacher_id = ?
    `, [id]);

    if (teachers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found."
      });
    }

    res.json({
      success: true,
      data: teachers[0]
    });

  } catch (error) {
    console.error("Get teacher error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve teacher."
    });
  }
};


// =====================================================
// GET CURRENT LOGGED-IN TEACHER PROFILE
// TEACHER ONLY
// =====================================================

const getMyTeacherProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User information is missing from authentication token."
      });
    }

    const [teachers] = await db.query(`
      SELECT
        t.teacher_id,
        t.user_id,
        u.name,
        u.email,
        u.status,
        t.department,
        t.designation,
        t.created_at
      FROM teachers t
      JOIN users u
        ON t.user_id = u.user_id
      WHERE t.user_id = ?
    `, [userId]);

    if (teachers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher profile retrieved successfully.",
      data: teachers[0]
    });

  } catch (error) {
    console.error(
      "Get my teacher profile error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve teacher profile."
    });
  }
};


// =====================================================
// UPDATE CURRENT LOGGED-IN TEACHER PROFILE
// TEACHER ONLY
// =====================================================

const updateMyTeacherProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const {
      name,
      email,
      department,
      designation
    } = req.body;

    if (
      !name ||
      !email ||
      !department ||
      !designation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, department and designation are required."
      });
    }

    // -------------------------------------------------
    // CHECK CURRENT TEACHER
    // -------------------------------------------------

    const [teacher] = await db.query(
      `
      SELECT teacher_id
      FROM teachers
      WHERE user_id = ?
      `,
      [userId]
    );

    if (teacher.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found."
      });
    }

    // -------------------------------------------------
    // CHECK DUPLICATE EMAIL
    // -------------------------------------------------

    const [emailExists] = await db.query(
      `
      SELECT user_id
      FROM users
      WHERE email = ?
      AND user_id != ?
      `,
      [
        email,
        userId
      ]
    );

    if (emailExists.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email address already exists."
      });
    }

    // -------------------------------------------------
    // UPDATE USER
    // -------------------------------------------------

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

    // -------------------------------------------------
    // UPDATE TEACHER
    // -------------------------------------------------

    await db.query(
      `
      UPDATE teachers
      SET
        department = ?,
        designation = ?
      WHERE user_id = ?
      `,
      [
        department,
        designation,
        userId
      ]
    );

    res.status(200).json({
      success: true,
      message: "Teacher profile updated successfully."
    });

  } catch (error) {
    console.error(
      "Update my teacher profile error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to update teacher profile."
    });
  }
};


// =====================================================
// CREATE TEACHER
// ADMIN ONLY
// =====================================================

const createTeacher = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      teacher_id,
      name,
      email,
      password,
      department,
      designation
    } = req.body;

    if (
      !teacher_id ||
      !name ||
      !email ||
      !password ||
      !department ||
      !designation
    ) {
      connection.release();

      return res.status(400).json({
        success: false,
        message:
          "Teacher ID, name, email, password, department and designation are required."
      });
    }

    await connection.beginTransaction();

    const [existingUserId] = await connection.query(
      "SELECT user_id FROM users WHERE user_id = ?",
      [teacher_id]
    );

    if (existingUserId.length > 0) {
      await connection.rollback();
      connection.release();

      return res.status(409).json({
        success: false,
        message: "Teacher ID already exists."
      });
    }

    const [existingEmail] = await connection.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existingEmail.length > 0) {
      await connection.rollback();
      connection.release();

      return res.status(409).json({
        success: false,
        message: "Email address already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      `INSERT INTO users
       (
         user_id,
         name,
         email,
         password,
         role,
         status
       )
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        teacher_id,
        name,
        email,
        hashedPassword,
        "teacher",
        "active"
      ]
    );

    await connection.query(
      `INSERT INTO teachers
       (
         teacher_id,
         user_id,
         department,
         designation
       )
       VALUES (?, ?, ?, ?)`,
      [
        teacher_id,
        teacher_id,
        department,
        designation
      ]
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      success: true,
      message: "Teacher created successfully."
    });

  } catch (error) {

    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error(
        "Rollback error:",
        rollbackError.message
      );
    }

    connection.release();

    console.error(
      "Create teacher error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create teacher."
    });
  }
};


// =====================================================
// UPDATE TEACHER
// ADMIN ONLY
// =====================================================

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      department,
      designation
    } = req.body;

    const [existing] = await db.query(
      `SELECT teacher_id, user_id
       FROM teachers
       WHERE teacher_id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found."
      });
    }

    if (
      !name ||
      !email ||
      !department ||
      !designation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, department and designation are required."
      });
    }

    const [emailExists] = await db.query(
      `SELECT user_id
       FROM users
       WHERE email = ?
       AND user_id != ?`,
      [
        email,
        existing[0].user_id
      ]
    );

    if (emailExists.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email address already exists."
      });
    }

    await db.query(
      `UPDATE users
       SET
         name = ?,
         email = ?
       WHERE user_id = ?`,
      [
        name,
        email,
        existing[0].user_id
      ]
    );

    await db.query(
      `UPDATE teachers
       SET
         department = ?,
         designation = ?
       WHERE teacher_id = ?`,
      [
        department,
        designation,
        id
      ]
    );

    res.json({
      success: true,
      message: "Teacher updated successfully."
    });

  } catch (error) {
    console.error(
      "Update teacher error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to update teacher."
    });
  }
};


// =====================================================
// DELETE TEACHER
// ADMIN ONLY
// =====================================================

const deleteTeacher = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;

    const [existing] = await connection.query(
      `SELECT teacher_id, user_id
       FROM teachers
       WHERE teacher_id = ?`,
      [id]
    );

    if (existing.length === 0) {
      connection.release();

      return res.status(404).json({
        success: false,
        message: "Teacher not found."
      });
    }

    await connection.beginTransaction();

    await connection.query(
      "DELETE FROM teachers WHERE teacher_id = ?",
      [id]
    );

    await connection.query(
      "DELETE FROM users WHERE user_id = ?",
      [existing[0].user_id]
    );

    await connection.commit();
    connection.release();

    res.json({
      success: true,
      message: "Teacher deleted successfully."
    });

  } catch (error) {

    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error(
        "Rollback error:",
        rollbackError.message
      );
    }

    connection.release();

    console.error(
      "Delete teacher error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete teacher."
    });
  }
};
// =====================================================
// GET CURRENT TEACHER DASHBOARD
// TEACHER ONLY
// =====================================================

const getMyTeacherDashboard = async (req, res) => {
  try {
    const userId = req.user.user_id;

    // -------------------------------------------------
    // CHECK AUTHENTICATED USER
    // -------------------------------------------------

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User information is missing from authentication token."
      });
    }

    // -------------------------------------------------
    // GET CURRENT TEACHER PROFILE
    // -------------------------------------------------

    const [teacherRows] = await db.query(
      `
      SELECT
        t.teacher_id,
        t.user_id,
        u.name,
        u.email,
        u.status,
        t.department,
        t.designation,
        t.created_at
      FROM teachers t
      INNER JOIN users u
        ON t.user_id = u.user_id
      WHERE t.user_id = ?
        AND u.role = 'teacher'
      LIMIT 1
      `,
      [userId]
    );

    // -------------------------------------------------
    // TEACHER NOT FOUND
    // -------------------------------------------------

    if (teacherRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found."
      });
    }

    const teacher = teacherRows[0];

    // -------------------------------------------------
    // COUNT ACTIVE STUDENTS
    // -------------------------------------------------

    const [studentRows] = await db.query(
      `
      SELECT COUNT(*) AS total_students
      FROM students s
      INNER JOIN users u
        ON s.user_id = u.user_id
      WHERE LOWER(u.role) = 'student'
        AND LOWER(u.status) = 'active'
      `
    );

    const totalStudents =
      Number(studentRows[0]?.total_students) || 0;

    // -------------------------------------------------
    // COUNT ACTIVE SUBJECTS
    // -------------------------------------------------

    const [subjectRows] = await db.query(
      `
      SELECT COUNT(*) AS total_subjects
      FROM subjects
      WHERE LOWER(status) = 'active'
      `
    );

    const totalSubjects =
      Number(subjectRows[0]?.total_subjects) || 0;

    // -------------------------------------------------
    // COUNT PUBLISHED / PASS RESULTS
    // -------------------------------------------------

    const [resultRows] = await db.query(
      `
      SELECT COUNT(*) AS total_results
      FROM results
      WHERE LOWER(status) = 'pass'
      `
    );

    const totalResults =
      Number(resultRows[0]?.total_results) || 0;

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Teacher dashboard retrieved successfully.",

      data: {
        teacher: {
          teacher_id: teacher.teacher_id,
          user_id: teacher.user_id,
          name: teacher.name,
          email: teacher.email,
          status: teacher.status,
          department: teacher.department,
          designation: teacher.designation,
          created_at: teacher.created_at
        },

        statistics: {
          students: totalStudents,
          subjects: totalSubjects,
          results: totalResults
        }
      }
    });

  } catch (error) {
    console.error(
      "Get teacher dashboard error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve teacher dashboard."
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getAllTeachers,
  getTeacherById,
  getMyTeacherProfile,
  updateMyTeacherProfile,
  getMyTeacherDashboard,
  createTeacher,
  updateTeacher,
  deleteTeacher
};