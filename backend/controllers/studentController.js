const db = require("../config/db");
const bcrypt = require("bcryptjs");


// =====================================================
// GET ALL STUDENTS
// =====================================================

const getAllStudents = async (req, res) => {
  try {
    const [students] = await db.query(`
      SELECT
        s.student_id,
        s.user_id,
        u.name,
        u.email,
        u.status,
        s.course_id,
        c.course_name,
        s.semester,
        s.admission_year,
        s.created_at
      FROM students s
      INNER JOIN users u
        ON s.user_id = u.user_id
      INNER JOIN courses c
        ON s.course_id = c.course_id
      ORDER BY s.student_id ASC
    `);

    return res.json({
      success: true,
      count: students.length,
      data: students,
    });

  } catch (error) {
    console.error(
      "Get students error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve students.",
    });
  }
};


// =====================================================
// GET STUDENT BY ID
// =====================================================

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [students] = await db.query(
      `
      SELECT
        s.student_id,
        s.user_id,
        u.name,
        u.email,
        u.status,
        s.course_id,
        c.course_name,
        s.semester,
        s.admission_year,
        s.created_at
      FROM students s
      INNER JOIN users u
        ON s.user_id = u.user_id
      INNER JOIN courses c
        ON s.course_id = c.course_id
      WHERE s.student_id = ?
      `,
      [id]
    );

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    return res.json({
      success: true,
      data: students[0],
    });

  } catch (error) {
    console.error(
      "Get student error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve student.",
    });
  }
};


// =====================================================
// CREATE STUDENT
// =====================================================

const createStudent = async (req, res) => {
  let connection;

  try {
    const {
      student_id,
      user_id,
      name,
      email,
      password,
      course_id,
      semester,
      admission_year,
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !student_id ||
      !user_id ||
      !name ||
      !email ||
      !password ||
      !course_id ||
      !semester ||
      !admission_year
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student ID, user ID, name, email, password, course ID, semester and admission year are required.",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters.",
      });
    }

    const semesterNumber = Number(semester);
    const admissionYearNumber = Number(admission_year);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid semester.",
      });
    }

    if (
      !Number.isInteger(admissionYearNumber) ||
      admissionYearNumber < 2000 ||
      admissionYearNumber > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid admission year.",
      });
    }

    // -------------------------------------------------
    // GET CONNECTION
    // -------------------------------------------------

    connection = await db.getConnection();

    await connection.beginTransaction();

    // -------------------------------------------------
    // CHECK STUDENT ID
    // -------------------------------------------------

    const [existingStudent] = await connection.query(
      `
      SELECT student_id
      FROM students
      WHERE student_id = ?
      `,
      [student_id.trim()]
    );

    if (existingStudent.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "Student ID already exists.",
      });
    }

    // -------------------------------------------------
    // CHECK USER ID
    // -------------------------------------------------

    const [existingUser] = await connection.query(
      `
      SELECT user_id
      FROM users
      WHERE user_id = ?
      `,
      [user_id.trim()]
    );

    if (existingUser.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "User ID already exists.",
      });
    }

    // -------------------------------------------------
    // CHECK EMAIL
    // -------------------------------------------------

    const [existingEmail] = await connection.query(
      `
      SELECT user_id
      FROM users
      WHERE email = ?
      `,
      [email.trim()]
    );

    if (existingEmail.length > 0) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "Email address already exists.",
      });
    }

    // -------------------------------------------------
    // CHECK COURSE
    // -------------------------------------------------

    const [courses] = await connection.query(
      `
      SELECT
        course_id,
        status
      FROM courses
      WHERE course_id = ?
      `,
      [course_id.trim()]
    );

    if (courses.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (
      String(courses[0].status).toLowerCase() !==
      "active"
    ) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "The selected course is inactive.",
      });
    }

    // -------------------------------------------------
    // HASH PASSWORD
    // -------------------------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // -------------------------------------------------
    // CREATE USER
    // -------------------------------------------------

    await connection.query(
      `
      INSERT INTO users
      (
        user_id,
        name,
        email,
        password,
        role,
        status
      )
      VALUES (?, ?, ?, ?, 'student', 'active')
      `,
      [
        user_id.trim(),
        name.trim(),
        email.trim(),
        hashedPassword,
      ]
    );

    // -------------------------------------------------
    // CREATE STUDENT
    // -------------------------------------------------

    await connection.query(
      `
      INSERT INTO students
      (
        student_id,
        user_id,
        course_id,
        semester,
        admission_year
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        student_id.trim(),
        user_id.trim(),
        course_id.trim(),
        semesterNumber,
        admissionYearNumber,
      ]
    );

    // -------------------------------------------------
    // COMMIT
    // -------------------------------------------------

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Student created successfully.",
    });

  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Rollback error:",
          rollbackError.message
        );
      }
    }

    console.error(
      "Create student error:",
      error.message
    );

    // Duplicate database constraint
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message:
          "Student ID, user ID or email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create student.",
    });

  } finally {
    if (connection) {
      connection.release();
    }
  }
};


// =====================================================
// UPDATE STUDENT
// =====================================================

  const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      course_id,
      semester,
      admission_year
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !course_id ||
      !semester ||
      !admission_year
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Course ID, semester and admission year are required.",
      });
    }

    const semesterNumber = Number(semester);
    const admissionYearNumber = Number(admission_year);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid semester.",
      });
    }

    if (
      !Number.isInteger(admissionYearNumber) ||
      admissionYearNumber < 2000 ||
      admissionYearNumber > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid admission year.",
      });
    }

    // -------------------------------------------------
    // CHECK STUDENT
    // -------------------------------------------------

    const [existing] = await db.query(
      `
      SELECT student_id
      FROM students
      WHERE student_id = ?
      `,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // -------------------------------------------------
    // CHECK COURSE
    // -------------------------------------------------

    const [courses] = await db.query(
      `
      SELECT
        course_id,
        status
      FROM courses
      WHERE course_id = ?
      `,
      [course_id.trim()]
    );

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (
      String(courses[0].status).toLowerCase() !==
      "active"
    ) {
      return res.status(400).json({
        success: false,
        message: "The selected course is inactive.",
      });
    }

    // -------------------------------------------------
    // UPDATE
    // -------------------------------------------------

    await db.query(
      `
      UPDATE students
      SET
        course_id = ?,
        semester = ?,
        admission_year = ?
      WHERE student_id = ?
      `,
      [
        course_id.trim(),
        semesterNumber,
        admissionYearNumber,
        id,
      ]
    );

    return res.json({
      success: true,
      message: "Student updated successfully.",
    });

  } catch (error) {
    console.error(
      "Update student error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update student.",
    });
  }
};


// =====================================================
// DELETE STUDENT
// =====================================================

const deleteStudent = async (req, res) => {
  let connection;

  try {
    const { id } = req.params;

    connection = await db.getConnection();

    await connection.beginTransaction();

    // -------------------------------------------------
    // GET STUDENT + USER
    // -------------------------------------------------

    const [students] = await connection.query(
      `
      SELECT
        student_id,
        user_id
      FROM students
      WHERE student_id = ?
      `,
      [id]
    );

    if (students.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const userId = students[0].user_id;

    // -------------------------------------------------
    // DELETE STUDENT
    // -------------------------------------------------

    await connection.query(
      `
      DELETE FROM students
      WHERE student_id = ?
      `,
      [id]
    );

    // -------------------------------------------------
    // DELETE USER ACCOUNT
    //
    // Only delete the linked student user.
    // -------------------------------------------------

    await connection.query(
      `
      DELETE FROM users
      WHERE user_id = ?
        AND role = 'student'
      `,
      [userId]
    );

    // -------------------------------------------------
    // COMMIT
    // -------------------------------------------------

    await connection.commit();

    return res.json({
      success: true,
      message:
        "Student and student account deleted successfully.",
    });

  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Rollback error:",
          rollbackError.message
        );
      }
    }

    console.error(
      "Delete student error:",
      error.message
    );

    // Foreign-key constraint
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message:
          "This student cannot be deleted because other records depend on the student account.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete student.",
    });

  } finally {
    if (connection) {
      connection.release();
    }
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};