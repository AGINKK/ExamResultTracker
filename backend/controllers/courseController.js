const db = require("../config/db");


// =====================================================
// GET ALL COURSES
// =====================================================

const getAllCourses = async (req, res) => {
  try {

    const [courses] = await db.query(
      `SELECT
        course_id,
        course_name,
        department,
        duration,
        status,
        created_at
       FROM courses
       ORDER BY course_id`
    );

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });

  } catch (error) {

    console.error(
      "Get courses error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve courses."
    });
  }
};


// =====================================================
// GET COURSE BY ID
// =====================================================

const getCourseById = async (req, res) => {
  try {

    const { id } = req.params;

    const [courses] = await db.query(
      `SELECT
        course_id,
        course_name,
        department,
        duration,
        status,
        created_at
       FROM courses
       WHERE course_id = ?`,
      [id]
    );

    if (courses.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Course not found."
      });
    }

    res.json({
      success: true,
      data: courses[0]
    });

  } catch (error) {

    console.error(
      "Get course error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to retrieve course."
    });
  }
};


// =====================================================
// CREATE COURSE
// =====================================================

const createCourse = async (req, res) => {
  try {

    const {
      course_id,
      course_name,
      department,
      duration,
      status
    } = req.body;


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !course_id ||
      !course_name ||
      !department ||
      !duration
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Course ID, name, department and duration are required."
      });
    }


    // -------------------------------------------------
    // CHECK DUPLICATE COURSE ID
    // -------------------------------------------------

    const [existingCourse] = await db.query(
      `SELECT course_id
       FROM courses
       WHERE course_id = ?`,
      [course_id]
    );

    if (existingCourse.length > 0) {

      return res.status(409).json({
        success: false,
        message: "Course ID already exists."
      });
    }


    // -------------------------------------------------
    // INSERT COURSE
    // -------------------------------------------------

    const finalStatus =
      status === "inactive"
        ? "inactive"
        : "active";


    await db.query(
      `INSERT INTO courses
       (
         course_id,
         course_name,
         department,
         duration,
         status
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        course_id.trim(),
        course_name.trim(),
        department.trim(),
        duration.trim(),
        finalStatus
      ]
    );


    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: {
        course_id: course_id.trim(),
        course_name: course_name.trim(),
        department: department.trim(),
        duration: duration.trim(),
        status: finalStatus
      }
    });

  } catch (error) {

    console.error(
      "Create course error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create course."
    });
  }
};


// =====================================================
// UPDATE COURSE
// =====================================================

const updateCourse = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      course_name,
      department,
      duration,
      status
    } = req.body;


    // -------------------------------------------------
    // CHECK COURSE
    // -------------------------------------------------

    const [existingCourse] = await db.query(
      `SELECT course_id
       FROM courses
       WHERE course_id = ?`,
      [id]
    );

    if (existingCourse.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Course not found."
      });
    }


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !course_name ||
      !department ||
      !duration ||
      !status
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Course name, department, duration and status are required."
      });
    }


    // -------------------------------------------------
    // VALID STATUS
    // -------------------------------------------------

    if (
      status !== "active" &&
      status !== "inactive"
    ) {

      return res.status(400).json({
        success: false,
        message: "Invalid course status."
      });
    }


    // -------------------------------------------------
    // UPDATE
    // -------------------------------------------------

    await db.query(
      `UPDATE courses
       SET
         course_name = ?,
         department = ?,
         duration = ?,
         status = ?
       WHERE course_id = ?`,
      [
        course_name.trim(),
        department.trim(),
        duration.trim(),
        status,
        id
      ]
    );


    res.json({
      success: true,
      message: "Course updated successfully."
    });

  } catch (error) {

    console.error(
      "Update course error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to update course."
    });
  }
};


// =====================================================
// DELETE COURSE
// =====================================================

const deleteCourse = async (req, res) => {
  try {

    const { id } = req.params;


    // -------------------------------------------------
    // CHECK COURSE
    // -------------------------------------------------

    const [existingCourse] = await db.query(
      `SELECT course_id
       FROM courses
       WHERE course_id = ?`,
      [id]
    );

    if (existingCourse.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Course not found."
      });
    }


    // -------------------------------------------------
    // CHECK STUDENTS
    // -------------------------------------------------

    const [students] = await db.query(
      `SELECT student_id
       FROM students
       WHERE course_id = ?
       LIMIT 1`,
      [id]
    );


    // -------------------------------------------------
    // CHECK SUBJECTS
    // -------------------------------------------------

    const [subjects] = await db.query(
      `SELECT subject_id
       FROM subjects
       WHERE course_id = ?
       LIMIT 1`,
      [id]
    );


    // -------------------------------------------------
    // CHECK EXAMS
    // -------------------------------------------------

    const [exams] = await db.query(
      `SELECT exam_id
       FROM exams
       WHERE course_id = ?
       LIMIT 1`,
      [id]
    );


    // -------------------------------------------------
    // PREVENT DELETE IF IN USE
    // -------------------------------------------------

    if (
      students.length > 0 ||
      subjects.length > 0 ||
      exams.length > 0
    ) {

      return res.status(409).json({
        success: false,
        message:
          "Course cannot be deleted because it is being used by other records."
      });
    }


    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    await db.query(
      `DELETE FROM courses
       WHERE course_id = ?`,
      [id]
    );


    res.json({
      success: true,
      message: "Course deleted successfully."
    });

  } catch (error) {

    console.error(
      "Delete course error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete course."
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};