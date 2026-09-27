import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  getExams,
  createExam,
  updateExam,
  deleteExam,
  getCourses,
} from "../services/api";
import "./AdminExams.css";

function AdminExams() {
  // =====================================================
  // STATE
  // =====================================================

  const [search, setSearch] = useState("");

  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    exam_id: "",
    exam_name: "",
    course_id: "",
    semester: "",
    academic_year: "",
    exam_date: "",
    status: "scheduled",
  });

  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // LOAD EXAMS
  // =====================================================

  const loadExams = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getExams();

      if (response.success) {
        setExams(response.data || []);
      } else {
        setError(response.message || "Failed to load exams.");
      }
    } catch (error) {
      console.error("Failed to load exams:", error);

      setError(
        error.message || "Unable to load exams from the server."
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
      const response = await getCourses();

      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadExams();
    loadCourses();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredExams = exams.filter((exam) => {
    const courseName =
      courses.find(
        (course) => course.course_id === exam.course_id
      )?.course_name || "";

    return `${exam.exam_id}
      ${exam.exam_name}
      ${exam.course_id}
      ${courseName}
      ${exam.semester}
      ${exam.academic_year}
      ${exam.exam_date}
      ${exam.status}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAddExam = () => {
    setEditingExam(null);

    setFormData({
      exam_id: "",
      exam_name: "",
      course_id: "",
      semester: "",
      academic_year: "",
      exam_date: "",
      status: "scheduled",
    });

    setFormError("");
    setError("");
    setSuccessMessage("");

    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (exam) => {
    setEditingExam(exam);

    setFormData({
      exam_id: exam.exam_id || "",
      exam_name: exam.exam_name || "",
      course_id: exam.course_id || "",
      semester: exam.semester || "",
      academic_year: exam.academic_year || "",
      exam_date: exam.exam_date
        ? exam.exam_date.substring(0, 10)
        : "",
      status: exam.status || "scheduled",
    });

    setFormError("");
    setError("");
    setSuccessMessage("");

    setShowModal(true);
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setError("");
    setSuccessMessage("");

    // Basic validation

    if (
      !formData.exam_name ||
      !formData.course_id ||
      !formData.semester ||
      !formData.academic_year ||
      !formData.exam_date
    ) {
      setFormError(
        "Please fill in all required fields."
      );

      return;
    }

    // Exam ID required only when creating

    if (!editingExam && !formData.exam_id) {
      setFormError("Exam ID is required.");

      return;
    }

    try {
      setSubmitting(true);

      let response;

      if (editingExam) {
        response = await updateExam(
          editingExam.exam_id,
          {
            exam_name: formData.exam_name,
            course_id: formData.course_id,
            semester: formData.semester,
            academic_year: formData.academic_year,
            exam_date: formData.exam_date,
            status: formData.status,
          }
        );
      } else {
        response = await createExam(formData);
      }

      if (response.success) {
        setShowModal(false);
        setEditingExam(null);
        setFormError("");

        if (editingExam) {
          setSuccessMessage(
            "Exam updated successfully."
          );
        } else {
          setSuccessMessage(
            "Exam created successfully."
          );
        }

        await loadExams();

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setFormError(
          response.message ||
            "Failed to save exam."
        );
      }
    } catch (error) {
      console.error(
        "Save exam error:",
        error
      );

      setFormError(
        error.message ||
          "Unable to save exam."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // DELETE EXAM
  // =====================================================

  const handleDelete = async (exam) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${exam.exam_name}"?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      const response = await deleteExam(
        exam.exam_id
      );

      if (response.success) {
        setSuccessMessage(
          "Exam deleted successfully."
        );

        await loadExams();

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setError(
          response.message ||
            "Failed to delete exam."
        );
      }
    } catch (error) {
      console.error(
        "Delete exam error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete exam."
      );
    }
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    if (submitting) {
      return;
    }

    setShowModal(false);
    setEditingExam(null);
    setFormError("");
  };

  // =====================================================
  // COURSE NAME
  // =====================================================

  const getCourseName = (courseId) => {
    const course = courses.find(
      (item) =>
        item.course_id === courseId
    );

    return course
      ? course.course_name
      : courseId;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <AdminLayout>
      <div className="admin-exams">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="admin-exams-header">

          <div>
            <h2>Exams</h2>

            <p>
              Create and manage academic
              examinations.
            </p>
          </div>

          <button
            type="button"
            className="admin-exams-primary-button"
            onClick={handleAddExam}
          >
            Add Exam
          </button>

        </section>


        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {successMessage && (
          <div className="admin-exams-success">
            {successMessage}
          </div>
        )}


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="admin-exams-error">
            {error}
          </div>
        )}


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="admin-exams-content">

          {/* SEARCH */}

          <div className="admin-exams-search">

            <input
              type="text"
              placeholder="Search by exam ID, name, course, or semester..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* TABLE */}

          <div className="admin-exams-table-container">

            <table>

              <thead>

                <tr>

                  <th>Exam ID</th>

                  <th>Exam Name</th>

                  <th>Course</th>

                  <th>Semester</th>

                  <th>Academic Year</th>

                  <th>Exam Date</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="admin-no-exams"
                    >
                      Loading exams...
                    </td>

                  </tr>

                ) : filteredExams.length > 0 ? (

                  filteredExams.map((exam) => (

                    <tr key={exam.exam_id}>

                      <td>
                        {exam.exam_id}
                      </td>

                      <td>
                        {exam.exam_name}
                      </td>

                      <td>
                        {getCourseName(
                          exam.course_id
                        )}
                      </td>

                      <td>
                        {exam.semester}
                      </td>

                      <td>
                        {exam.academic_year}
                      </td>

                      <td>
                        {formatDate(
                          exam.exam_date
                        )}
                      </td>

                      <td>

                        <span
                          className={`admin-exam-status admin-exam-status-${String(
                            exam.status
                          ).toLowerCase()}`}
                        >
                          {exam.status}
                        </span>

                      </td>

                      <td>

                        <div className="admin-exam-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(exam)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(exam)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="8"
                      className="admin-no-exams"
                    >
                      No exams found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* =================================================
            ADD / EDIT MODAL
        ================================================= */}

        {showModal && (

          <div className="admin-exam-modal-overlay">

            <div className="admin-exam-modal">

              <div className="admin-exam-modal-header">

                <div>

                  <h3>
                    {editingExam
                      ? "Edit Exam"
                      : "Add Exam"}
                  </h3>

                  <p>
                    {editingExam
                      ? "Update examination details."
                      : "Enter the examination details."}
                  </p>

                </div>

                <button
                  type="button"
                  className="admin-exam-modal-close"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  ×
                </button>

              </div>


              {/* FORM ERROR */}

              {formError && (
                <div className="admin-exam-form-error">
                  {formError}
                </div>
              )}


              <form
                onSubmit={handleSubmit}
                className="admin-exam-form"
              >

                {/* EXAM ID */}

                <div className="admin-exam-form-group">

                  <label>
                    Exam ID
                  </label>

                  <input
                    type="text"
                    name="exam_id"
                    placeholder="Example: EXM005"
                    value={formData.exam_id}
                    onChange={handleChange}
                    disabled={Boolean(
                      editingExam
                    )}
                  />

                </div>


                {/* EXAM NAME */}

                <div className="admin-exam-form-group">

                  <label>
                    Exam Name
                  </label>

                  <input
                    type="text"
                    name="exam_name"
                    placeholder="Example: Semester 5 Examination"
                    value={formData.exam_name}
                    onChange={handleChange}
                  />

                </div>


                {/* COURSE */}

                <div className="admin-exam-form-group">

                  <label>
                    Course
                  </label>

                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Course
                    </option>

                    {courses.map((course) => (

                      <option
                        key={course.course_id}
                        value={course.course_id}
                      >
                        {course.course_name} (
                        {course.course_id})
                      </option>

                    ))}

                  </select>

                </div>


                {/* SEMESTER */}

                <div className="admin-exam-form-group">

                  <label>
                    Semester
                  </label>

                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Semester
                    </option>

                    <option value="Semester 1">
                      Semester 1
                    </option>

                    <option value="Semester 2">
                      Semester 2
                    </option>

                    <option value="Semester 3">
                      Semester 3
                    </option>

                    <option value="Semester 4">
                      Semester 4
                    </option>

                    <option value="Semester 5">
                      Semester 5
                    </option>

                    <option value="Semester 6">
                      Semester 6
                    </option>

                    <option value="Semester 7">
                      Semester 7
                    </option>

                    <option value="Semester 8">
                      Semester 8
                    </option>

                  </select>

                </div>


                {/* ACADEMIC YEAR */}

                <div className="admin-exam-form-group">

                  <label>
                    Academic Year
                  </label>

                  <input
                    type="text"
                    name="academic_year"
                    placeholder="Example: 2026-2027"
                    value={
                      formData.academic_year
                    }
                    onChange={handleChange}
                  />

                </div>


                {/* EXAM DATE */}

                <div className="admin-exam-form-group">

                  <label>
                    Exam Date
                  </label>

                  <input
                    type="date"
                    name="exam_date"
                    value={
                      formData.exam_date
                    }
                    onChange={handleChange}
                  />

                </div>


                {/* STATUS */}

                <div className="admin-exam-form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >

                    <option value="scheduled">
                      Scheduled
                    </option>

                    <option value="ongoing">
                      Ongoing
                    </option>

                    <option value="completed">
                      Completed
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>


                {/* BUTTONS */}

                <div className="admin-exam-form-actions">

                  <button
                    type="button"
                    className="admin-exam-cancel-button"
                    onClick={handleCloseModal}
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-exam-save-button"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Saving..."
                      : editingExam
                      ? "Update Exam"
                      : "Create Exam"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>
    </AdminLayout>
  );
}

export default AdminExams;