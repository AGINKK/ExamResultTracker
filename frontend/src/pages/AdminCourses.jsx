import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/api";
import "./AdminCourses.css";

function AdminCourses() {
  // =====================================================
  // STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    course_id: "",
    course_name: "",
    department: "",
    duration: "",
    status: "active",
  });


  // =====================================================
  // LOAD COURSES
  // =====================================================

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourses();

      if (response.success) {
        setCourses(response.data || []);
      } else {
        setError(response.message || "Failed to load courses.");
      }

    } catch (error) {
      console.error("Failed to load courses:", error);
      setError("Unable to load courses from the server.");

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadCourses();
  }, []);


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredCourses = courses.filter((course) =>
    `${course.course_id || ""}
     ${course.course_name || ""}
     ${course.department || ""}
     ${course.duration || ""}
     ${course.status || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  // =====================================================
  // OPEN ADD COURSE MODAL
  // =====================================================

  const handleAddCourse = () => {
    setEditingCourse(null);

    setFormData({
      course_id: "",
      course_name: "",
      department: "",
      duration: "",
      status: "active",
    });

    setFormError("");
    setShowModal(true);
  };


  // =====================================================
  // OPEN EDIT COURSE MODAL
  // =====================================================

  const handleEdit = (course) => {
    setEditingCourse(course);

    setFormData({
      course_id: course.course_id || "",
      course_name: course.course_name || "",
      department: course.department || "",
      duration: course.duration || "",
      status: course.status || "active",
    });

    setFormError("");
    setShowModal(true);
  };


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingCourse(null);
    setFormError("");
  };


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
  // SAVE COURSE
  // =====================================================

  const handleSubmit = async (e) => {
   e.preventDefault();

    setFormError("");
    setError("");
    setSuccessMessage("");

    // Frontend validation
    if (!formData.course_id.trim()) {
      setFormError("Course ID is required.");
      return;
    }

    if (!formData.course_name.trim()) {
      setFormError("Course name is required.");
      return;
    }

    if (!formData.department.trim()) {
      setFormError("Department is required.");
      return;
    }

    if (!formData.duration.trim()) {
      setFormError("Duration is required.");
      return;
    }

    try {
      setSaving(true);

      let response;

      // EDIT
      if (editingCourse) {
        response = await updateCourse(
          editingCourse.course_id,
          {
            course_name: formData.course_name.trim(),
            department: formData.department.trim(),
            duration: formData.duration.trim(),
            status: formData.status,
          }
        );

      } else {
        // CREATE
        response = await createCourse({
          course_id: formData.course_id.trim(),
          course_name: formData.course_name.trim(),
          department: formData.department.trim(),
          duration: formData.duration.trim(),
          status: formData.status,
        });
      }

if (response.success) {
  setShowModal(false);
  setEditingCourse(null);
  setFormError("");

  if (editingCourse) {
    setSuccessMessage("Course updated successfully.");
  } else {
    setSuccessMessage("Course added successfully.");
  }

  await loadCourses();

  setTimeout(() => {
    setSuccessMessage("");
  }, 3000);
} else {
        setFormError(
          response.message ||
          "Unable to save course."
        );
      }

    } catch (error) {
      console.error("Save course error:", error);

      setFormError(
        error.message ||
        "Unable to save course."
      );

    } finally {
      setSaving(false);
    }
  };


  // =====================================================
  // DELETE COURSE
  // =====================================================

  const handleDelete = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.course_name}"?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      setDeletingId(course.course_id);
      setError("");

      const response = await deleteCourse(
        course.course_id
      );

      if (response.success) {
       setSuccessMessage("Course deleted successfully.");

      await loadCourses();

  setTimeout(() => {
    setSuccessMessage("");
  }, 3000);
} else {
        setError(
          response.message ||
          "Unable to delete course."
        );
      }

    } catch (error) {
      console.error("Delete course error:", error);

      setError(
        error.message ||
        "Unable to delete course."
      );

    } finally {
      setDeletingId(null);
    }
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <AdminLayout>

      <div className="admin-courses">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="admin-courses-header">

          <div>
            <h2>Courses</h2>

            <p>
              Create and manage academic courses offered
              by the institution.
            </p>
          </div>

          <button
            type="button"
            className="admin-courses-primary-button"
            onClick={handleAddCourse}
          >
            Add Course
          </button>

        </section>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="admin-courses-content">

          {/* SEARCH */}

          <div className="admin-courses-search">

            <input
              type="text"
              placeholder="Search by course ID, name, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          {/* SUCCESS MESSAGE */}

{successMessage && (
  <div className="admin-courses-success">
    {successMessage}
  </div>
)}


{/* ERROR */}

{error && (
  <div className="admin-courses-error">
    {error}
  </div>
)}


          {/* TABLE */}

          <div className="admin-courses-table-container">

            <table>

              <thead>

                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Department</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="admin-no-courses"
                    >
                      Loading courses...
                    </td>

                  </tr>

                ) : filteredCourses.length > 0 ? (

                  filteredCourses.map((course) => (

                    <tr key={course.course_id}>

                      <td>
                        {course.course_id}
                      </td>

                      <td>
                        {course.course_name}
                      </td>

                      <td>
                        {course.department}
                      </td>

                      <td>
                        {course.duration}
                      </td>

                      <td>

                        <span
                          className={`admin-course-status ${
                            course.status === "active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {course.status}
                        </span>

                      </td>

                      <td>

                        <div className="admin-course-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(course)
                            }
                            disabled={
                              deletingId ===
                              course.course_id
                            }
                          >
                            Edit
                          </button>


                          <button
                            type="button"
                            className="admin-course-delete-button"
                            onClick={() =>
                              handleDelete(course)
                            }
                            disabled={
                              deletingId ===
                              course.course_id
                            }
                          >
                            {deletingId ===
                            course.course_id
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
                      colSpan="6"
                      className="admin-no-courses"
                    >
                      {search
                        ? "No courses found matching your search."
                        : "No courses found."}
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

          <div
            className="admin-course-modal-overlay"
            onMouseDown={(e) => {

              if (
                e.target === e.currentTarget &&
                !saving
              ) {
                handleCloseModal();
              }

            }}
          >

            <div className="admin-course-modal">

              {/* MODAL HEADER */}

              <div className="admin-course-modal-header">

                <div>

                  <h3>
                    {editingCourse
                      ? "Edit Course"
                      : "Add Course"}
                  </h3>

                  <p>
                    {editingCourse
                      ? "Update the course details below."
                      : "Enter the details for the new course."}
                  </p>

                </div>

                <button
                  type="button"
                  className="admin-course-modal-close"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  ×
                </button>

              </div>


              {/* FORM */}

              <form
                className="admin-course-form"
                onSubmit={handleSubmit}
              >

                {/* COURSE ID */}

                <div className="admin-course-form-group">

                  <label htmlFor="course_id">
                    Course ID
                  </label>

                  <input
                    id="course_id"
                    name="course_id"
                    type="text"
                    placeholder="Example: CRS004"
                    value={formData.course_id}
                    onChange={handleChange}
                    disabled={Boolean(editingCourse) || saving}
                  />

                </div>


                {/* COURSE NAME */}

                <div className="admin-course-form-group">

                  <label htmlFor="course_name">
                    Course Name
                  </label>

                  <input
                    id="course_name"
                    name="course_name"
                    type="text"
                    placeholder="Example: Master of Computer Applications"
                    value={formData.course_name}
                    onChange={handleChange}
                    disabled={saving}
                  />

                </div>


                {/* DEPARTMENT */}

                <div className="admin-course-form-group">

                  <label htmlFor="department">
                    Department
                  </label>

                  <input
                    id="department"
                    name="department"
                    type="text"
                    placeholder="Example: Computer Applications"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={saving}
                  />

                </div>


                {/* DURATION */}

                <div className="admin-course-form-group">

                  <label htmlFor="duration">
                    Duration
                  </label>

                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    placeholder="Example: 2 Years"
                    value={formData.duration}
                    onChange={handleChange}
                    disabled={saving}
                  />

                </div>


                {/* STATUS */}

                <div className="admin-course-form-group">

                  <label htmlFor="status">
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={saving}
                  >

                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>

                  </select>

                </div>


                {/* FORM ERROR */}

                {formError && (

                  <div className="admin-course-form-error">
                    {formError}
                  </div>

                )}


                {/* BUTTONS */}

                <div className="admin-course-form-actions">

                  <button
                    type="button"
                    className="admin-course-cancel-button"
                    onClick={handleCloseModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="admin-course-save-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingCourse
                      ? "Update Course"
                      : "Add Course"}
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

export default AdminCourses;