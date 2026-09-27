import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getCourses,
} from "../services/api";

import "./AdminStudents.css";

function AdminStudents() {
  // =====================================================
  // STATE
  // =====================================================

  const [search, setSearch] = useState("");

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formError, setFormError] = useState("");

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    student_id: "",
    user_id: "",
    name: "",
    email: "",
    password: "",
    course_id: "",
    semester: "",
    admission_year: "",
  });

  const [selectedStudent, setSelectedStudent] = useState(null);

  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getStudents();

      if (response.success) {
        setStudents(response.data || []);
      } else {
        setError(response.message || "Failed to load students.");
      }
    } catch (error) {
      console.error("Failed to load students:", error);

      setError(
        error.message || "Unable to load students from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD COURSES
  // =====================================================

  const loadCourses = async () => {
    try {
      setCoursesLoading(true);

      const response = await getCourses();

      if (response.success) {
        setCourses(response.data || []);
      } else {
        console.error(
          response.message || "Failed to load courses."
        );
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setCoursesLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadStudents();
    loadCourses();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredStudents = students.filter((student) => {
    const searchText = `
      ${student.student_id || ""}
      ${student.user_id || ""}
      ${student.name || ""}
      ${student.email || ""}
      ${student.course_id || ""}
      ${student.course_name || ""}
      ${student.semester || ""}
      ${student.admission_year || ""}
      ${student.status || ""}
    `.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
    setError("");
    setSuccess("");
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddStudent = () => {
    setFormMode("add");

    setSelectedStudent(null);

    setFormData({
      student_id: "",
      user_id: "",
      name: "",
      email: "",
      password: "",
      course_id: "",
      semester: "",
      admission_year: "",
    });

    setFormError("");
    setError("");
    setSuccess("");

    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const handleEdit = (student) => {
    setFormMode("edit");

    setSelectedStudent(student);

    setFormData({
      student_id: student.student_id || "",
      user_id: student.user_id || "",
      name: student.name || "",
      email: student.email || "",
      password: "",
      course_id: student.course_id || "",
      semester: student.semester || "",
      admission_year: student.admission_year || "",
    });

    setFormError("");
    setError("");
    setSuccess("");

    setShowForm(true);
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const handleCancel = () => {
    if (saving) {
      return;
    }

    setShowForm(false);
    setFormError("");

    setFormData({
      student_id: "",
      user_id: "",
      name: "",
      email: "",
      password: "",
      course_id: "",
      semester: "",
      admission_year: "",
    });

    setSelectedStudent(null);
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    // ---------------------------------------------------
    // ADD VALIDATION
    // ---------------------------------------------------

    if (formMode === "add") {
      if (!formData.student_id.trim()) {
        return "Student ID is required.";
      }

      if (!formData.user_id.trim()) {
        return "User ID is required.";
      }

      if (!formData.name.trim()) {
        return "Student name is required.";
      }

      if (!formData.email.trim()) {
        return "Email is required.";
      }

      if (!formData.password) {
        return "Password is required.";
      }

      if (formData.password.length < 6) {
        return "Password must contain at least 6 characters.";
      }
    }

    // ---------------------------------------------------
    // COMMON VALIDATION
    // ---------------------------------------------------

    if (!formData.course_id.trim()) {
      return "Course is required.";
    }

    if (!formData.semester) {
      return "Semester is required.";
    }

    if (!formData.admission_year) {
      return "Admission year is required.";
    }

    const semesterNumber = Number(formData.semester);
    const admissionYearNumber = Number(formData.admission_year);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 8
    ) {
      return "Please select a valid semester.";
    }

    if (
      !Number.isInteger(admissionYearNumber) ||
      admissionYearNumber < 2000 ||
      admissionYearNumber > 2100
    ) {
      return "Please enter a valid admission year.";
    }

    // ---------------------------------------------------
    // EMAIL VALIDATION
    // ---------------------------------------------------

    if (formMode === "add") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(formData.email.trim())) {
        return "Please enter a valid email address.";
      }
    }

    return "";
  };

  // =====================================================
  // SAVE STUDENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSaving(true);

      // =================================================
      // ADD STUDENT
      // =================================================

      if (formMode === "add") {
        const response = await createStudent({
          student_id: formData.student_id.trim(),
          user_id: formData.user_id.trim(),
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          course_id: formData.course_id.trim(),
          semester: Number(formData.semester),
          admission_year: Number(formData.admission_year),
        });

        if (!response.success) {
          setFormError(
            response.message || "Unable to create student."
          );
          return;
        }

        setSuccess("Student created successfully.");

        setShowForm(false);

        setFormData({
          student_id: "",
          user_id: "",
          name: "",
          email: "",
          password: "",
          course_id: "",
          semester: "",
          admission_year: "",
        });

        await loadStudents();

        return;
      }

      // =================================================
      // UPDATE STUDENT
      // =================================================

      if (formMode === "edit" && selectedStudent) {
        const response = await updateStudent(
          selectedStudent.student_id,
          {
            course_id: formData.course_id.trim(),
            semester: Number(formData.semester),
            admission_year: Number(formData.admission_year),
          }
        );

        if (!response.success) {
          setFormError(
            response.message || "Unable to update student."
          );
          return;
        }

        setSuccess("Student updated successfully.");

        setShowForm(false);

        setSelectedStudent(null);

        setFormData({
          student_id: "",
          user_id: "",
          name: "",
          email: "",
          password: "",
          course_id: "",
          semester: "",
          admission_year: "",
        });

        await loadStudents();
      }
    } catch (error) {
      console.error("Save student error:", error);

      setFormError(
        error.message ||
          "Unable to save student. Please check the server connection."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const handleDelete = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete student "${student.name}" (${student.student_id})?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(student.student_id);

      setError("");
      setSuccess("");

      const response = await deleteStudent(
        student.student_id
      );

      if (!response.success) {
        setError(
          response.message || "Unable to delete student."
        );
        return;
      }

      setSuccess("Student deleted successfully.");

      await loadStudents();
    } catch (error) {
      console.error("Delete student error:", error);

      setError(
        error.message ||
          "Unable to delete student. Please check the server connection."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <AdminLayout>
      <div className="admin-students">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="admin-page-header">
          <div>
            <h2>Students</h2>

            <p>
              View and manage registered student records.
            </p>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={handleAddStudent}
          >
            + Add Student
          </button>
        </section>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {success && (
          <div className="admin-student-message success">
            {success}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="admin-student-message error">
            {error}
          </div>
        )}

        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        {showForm && (
          <section className="admin-student-form-card">

            <div className="admin-student-form-header">
              <div>
                <h3>
                  {formMode === "add"
                    ? "Add Student"
                    : "Edit Student"}
                </h3>

                <p>
                  {formMode === "add"
                    ? "Create a student account and academic record."
                    : "Update the student's academic information."}
                </p>
              </div>
            </div>

            {formError && (
              <div className="admin-student-form-error">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="admin-student-form-grid">

                {/* STUDENT ID */}

                <div className="admin-form-group">
                  <label htmlFor="student_id">
                    Student ID
                  </label>

                  <input
                    id="student_id"
                    name="student_id"
                    type="text"
                    value={formData.student_id}
                    onChange={handleFormChange}
                    placeholder="Example: STU004"
                    disabled={formMode === "edit" || saving}
                  />

                  {formMode === "edit" && (
                    <small>
                      Student ID cannot be changed.
                    </small>
                  )}
                </div>

                {/* USER ID */}

                <div className="admin-form-group">
                  <label htmlFor="user_id">
                    User ID
                  </label>

                  <input
                    id="user_id"
                    name="user_id"
                    type="text"
                    value={formData.user_id}
                    onChange={handleFormChange}
                    placeholder="Example: STU004"
                    disabled={formMode === "edit" || saving}
                  />

                  {formMode === "edit" && (
                    <small>
                      User ID cannot be changed.
                    </small>
                  )}
                </div>

                {/* NAME */}

                <div className="admin-form-group">
                  <label htmlFor="name">
                    Student Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Example: Kiran Kumar"
                    disabled={formMode === "edit" || saving}
                  />

                  {formMode === "edit" && (
                    <small>
                      Student name is linked to the user account.
                    </small>
                  )}
                </div>

                {/* EMAIL */}

                <div className="admin-form-group">
                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Example: kiran.kumar@examtracker.com"
                    disabled={formMode === "edit" || saving}
                  />

                  {formMode === "edit" && (
                    <small>
                      Email is linked to the user account.
                    </small>
                  )}
                </div>

                {/* PASSWORD */}

                {formMode === "add" && (
                  <div className="admin-form-group">
                    <label htmlFor="password">
                      Password
                    </label>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      placeholder="Minimum 6 characters"
                      disabled={saving}
                    />

                    <small>
                      Password will be securely hashed before storage.
                    </small>
                  </div>
                )}

                {/* COURSE */}

                <div className="admin-form-group">
                  <label htmlFor="course_id">
                    Course
                  </label>

                  <select
                    id="course_id"
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleFormChange}
                    disabled={saving || coursesLoading}
                  >
                    <option value="">
                      {coursesLoading
                        ? "Loading courses..."
                        : "Select Course"}
                    </option>

                    {courses.map((course) => (
                      <option
                        key={course.course_id}
                        value={course.course_id}
                      >
                        {course.course_id} -{" "}
                        {course.course_name}
                      </option>
                    ))}
                  </select>

                  {!coursesLoading &&
                    courses.length === 0 && (
                      <small className="admin-form-warning">
                        No courses available.
                      </small>
                    )}
                </div>

                {/* SEMESTER */}

                <div className="admin-form-group">
                  <label htmlFor="semester">
                    Semester
                  </label>

                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleFormChange}
                    disabled={saving}
                  >
                    <option value="">
                      Select Semester
                    </option>

                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                  </select>
                </div>

                {/* ADMISSION YEAR */}

                <div className="admin-form-group">
                  <label htmlFor="admission_year">
                    Admission Year
                  </label>

                  <input
                    id="admission_year"
                    name="admission_year"
                    type="number"
                    min="2000"
                    max="2100"
                    value={formData.admission_year}
                    onChange={handleFormChange}
                    placeholder="Example: 2026"
                    disabled={saving}
                  />
                </div>

              </div>

              {/* FORM BUTTONS */}

              <div className="admin-student-form-actions">

                <button
                  type="button"
                  className="admin-student-cancel-button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-student-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : formMode === "add"
                    ? "Create Student"
                    : "Update Student"}
                </button>

              </div>

            </form>
          </section>
        )}

        {/* =================================================
            STUDENT TABLE
        ================================================= */}

        <section className="admin-students-content">

          {/* SEARCH */}

          <div className="admin-search-box">

            <input
              type="text"
              placeholder="Search by ID, name, email, course, semester..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* TABLE */}

          <div className="admin-students-table-container">

            <table>

              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Email</th>
                  <th>Admission Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="admin-no-students"
                    >
                      Loading students...
                    </td>
                  </tr>

                ) : error && students.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="admin-no-students error-text"
                    >
                      {error}
                    </td>
                  </tr>

                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.student_id}>

                      {/* STUDENT ID */}

                      <td className="student-id-cell">
                        {student.student_id}
                      </td>

                      {/* NAME */}

                      <td>
                        <div className="student-name">
                          {student.name || "—"}
                        </div>
                      </td>

                      {/* COURSE */}

                      <td>
                        <div>
                          <strong>
                            {student.course_id || "—"}
                          </strong>

                          {student.course_name && (
                            <span className="student-course-name">
                              {student.course_name}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* SEMESTER */}

                      <td>
                        Semester {student.semester}
                      </td>

                      {/* EMAIL */}

                      <td>
                        {student.email || "—"}
                      </td>

                      {/* ADMISSION YEAR */}

                      <td>
                        {student.admission_year || "—"}
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`admin-student-status ${
                            String(student.status).toLowerCase() ===
                            "active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {student.status || "Unknown"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="admin-student-actions">

                          <button
                            type="button"
                            className="student-edit-button"
                            onClick={() =>
                              handleEdit(student)
                            }
                            disabled={
                              deletingId ===
                              student.student_id
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="student-delete-button"
                            onClick={() =>
                              handleDelete(student)
                            }
                            disabled={
                              deletingId ===
                              student.student_id
                            }
                          >
                            {deletingId ===
                            student.student_id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))

                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="admin-no-students"
                    >
                      {search
                        ? "No students match your search."
                        : "No students found."}
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>
    </AdminLayout>
  );
}

export default AdminStudents;