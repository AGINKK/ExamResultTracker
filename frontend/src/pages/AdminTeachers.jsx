import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from "../services/api";
import "./AdminTeachers.css";

function AdminTeachers() {

  // =====================================================
  // STATE
  // =====================================================

  const [teachers, setTeachers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [editingTeacher, setEditingTeacher] = useState(null);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [formError, setFormError] = useState("");


  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    teacher_id: "",
    name: "",
    email: "",
    password: "",
    department: "",
    designation: ""
  });


  // =====================================================
  // LOAD TEACHERS
  // =====================================================

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTeachers();

      if (response.success) {
        setTeachers(response.data);
      } else {
        setError(response.message || "Failed to load teachers.");
      }

    } catch (err) {
      console.error("Load teachers error:", err);

      setError(
        err.message || "Failed to load teachers."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadTeachers();
  }, []);


  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddTeacher = () => {

    setEditingTeacher(null);

    setFormData({
      teacher_id: "",
      name: "",
      email: "",
      password: "",
      department: "",
      designation: ""
    });

    setFormError("");
    setMessage("");
    setError("");

    setShowForm(true);
  };


  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const handleEdit = (teacher) => {

    setEditingTeacher(teacher);

    setFormData({
      teacher_id: teacher.teacher_id,
      name: teacher.name || "",
      email: teacher.email || "",
      password: "",
      department: teacher.department || "",
      designation: teacher.designation || ""
    });

    setFormError("");
    setMessage("");
    setError("");

    setShowForm(true);
  };


  // =====================================================
  // CANCEL FORM
  // =====================================================

  const handleCancel = () => {

    setShowForm(false);

    setEditingTeacher(null);

    setFormError("");

    setFormData({
      teacher_id: "",
      name: "",
      email: "",
      password: "",
      department: "",
      designation: ""
    });
  };


  // =====================================================
  // SAVE TEACHER
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setFormError("");
    setMessage("");
    setError("");


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !formData.teacher_id ||
      !formData.name ||
      !formData.email ||
      !formData.department ||
      !formData.designation
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }


    // Password required only while creating

    if (!editingTeacher && !formData.password) {
      setFormError("Password is required when creating a teacher.");
      return;
    }


    try {

      setSaving(true);


      // =================================================
      // EDIT
      // =================================================

      if (editingTeacher) {

        const response = await updateTeacher(
          editingTeacher.teacher_id,
          {
            name: formData.name,
            email: formData.email,
            department: formData.department,
            designation: formData.designation
          }
        );

        if (!response.success) {
          setFormError(
            response.message || "Failed to update teacher."
          );
          return;
        }

        setMessage("Teacher updated successfully.");
      }


      // =================================================
      // CREATE
      // =================================================

      else {

        const response = await createTeacher({
          teacher_id: formData.teacher_id,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          department: formData.department,
          designation: formData.designation
        });

        if (!response.success) {
          setFormError(
            response.message || "Failed to create teacher."
          );
          return;
        }

        setMessage("Teacher created successfully.");
      }


      // =================================================
      // CLOSE FORM
      // =================================================

      setShowForm(false);

      setEditingTeacher(null);

      setFormData({
        teacher_id: "",
        name: "",
        email: "",
        password: "",
        department: "",
        designation: ""
      });


      // =================================================
      // REFRESH TABLE
      // =================================================

      await loadTeachers();

    } catch (err) {

      console.error("Save teacher error:", err);

      setFormError(
        err.message || "Unable to save teacher. Please try again."
      );

    } finally {

      setSaving(false);
    }
  };


  // =====================================================
  // DELETE TEACHER
  // =====================================================

  const handleDelete = async (teacher) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete ${teacher.name}?`
    );

    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(teacher.teacher_id);

      setMessage("");
      setError("");

      const response = await deleteTeacher(
        teacher.teacher_id
      );

      if (!response.success) {

        setError(
          response.message || "Failed to delete teacher."
        );

        return;
      }

      setMessage("Teacher deleted successfully.");

      await loadTeachers();

    } catch (err) {

      console.error("Delete teacher error:", err);

      setError(
        err.message || "Failed to delete teacher."
      );

    } finally {

      setDeletingId(null);
    }
  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredTeachers = teachers.filter((teacher) => {

    const searchText = search.toLowerCase();

    return (
      `${teacher.teacher_id}
       ${teacher.name}
       ${teacher.email}
       ${teacher.department}
       ${teacher.designation}
       ${teacher.status}`
        .toLowerCase()
        .includes(searchText)
    );
  });


  // =====================================================
  // UI
  // =====================================================

  return (
    <AdminLayout>

      <div className="admin-teachers">


        {/* =================================================
            HEADER
        ================================================= */}

        <section className="admin-teachers-header">

          <div>

            <h2>Teachers</h2>

            <p>
              View and manage registered teacher records.
            </p>

          </div>


          <button
            type="button"
            className="admin-teachers-primary-button"
            onClick={handleAddTeacher}
          >
            Add Teacher
          </button>

        </section>


        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div className="admin-teacher-message success">
            {message}
          </div>
        )}


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="admin-teacher-message error">
            {error}
          </div>
        )}


        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        {showForm && (

          <section className="admin-teacher-form-card">

            <div className="admin-teacher-form-header">

              <h3>
                {editingTeacher
                  ? "Edit Teacher"
                  : "Add Teacher"}
              </h3>

              <p>
                {editingTeacher
                  ? "Update teacher account and profile details."
                  : "Create a new teacher account and profile."}
              </p>

            </div>


            {formError && (
              <div className="admin-teacher-form-error">
                {formError}
              </div>
            )}


            <form onSubmit={handleSubmit}>

              <div className="admin-teacher-form-grid">


                {/* =================================================
                    TEACHER ID
                ================================================= */}

                <div className="admin-form-group">

                  <label htmlFor="teacher_id">
                    Teacher ID
                  </label>

                  <input
                    id="teacher_id"
                    name="teacher_id"
                    type="text"
                    placeholder="Example: TEA003"
                    value={formData.teacher_id}
                    onChange={handleChange}
                    disabled={!!editingTeacher}
                  />

                  {editingTeacher && (
                    <small>
                      Teacher ID cannot be changed while editing.
                    </small>
                  )}

                </div>


                {/* =================================================
                    NAME
                ================================================= */}

                <div className="admin-form-group">

                  <label htmlFor="name">
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Example: Dr. Rahul Thomas"
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>


                {/* =================================================
                    EMAIL
                ================================================= */}

                <div className="admin-form-group">

                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Example: rahul@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>


                {/* =================================================
                    PASSWORD
                ================================================= */}

                {!editingTeacher && (
                  <div className="admin-form-group">

                    <label htmlFor="password">
                      Password
                    </label>

                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter login password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    <small>
                      This password will be used by the teacher to log in.
                    </small>

                  </div>
                )}


                {/* =================================================
                    DEPARTMENT
                ================================================= */}

                <div className="admin-form-group">

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
                  />

                </div>


                {/* =================================================
                    DESIGNATION
                ================================================= */}

                <div className="admin-form-group">

                  <label htmlFor="designation">
                    Designation
                  </label>

                  <input
                    id="designation"
                    name="designation"
                    type="text"
                    placeholder="Example: Assistant Professor"
                    value={formData.designation}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* =================================================
                  FORM ACTIONS
              ================================================= */}

              <div className="admin-teacher-form-actions">

                <button
                  type="button"
                  className="admin-teacher-cancel-button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-teacher-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingTeacher
                      ? "Update Teacher"
                      : "Save Teacher"}
                </button>

              </div>

            </form>

          </section>
        )}


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="admin-teachers-content">


          {/* SEARCH */}

          <div className="admin-teachers-search">

            <input
              type="text"
              placeholder="Search by ID, name, email, department, designation, or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>


          {/* TABLE */}

          <div className="admin-teachers-table-container">

            <table>

              <thead>

                <tr>
                  <th>Teacher ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="admin-no-teachers"
                    >
                      Loading teachers...
                    </td>

                  </tr>

                ) : filteredTeachers.length > 0 ? (

                  filteredTeachers.map((teacher) => (

                    <tr key={teacher.teacher_id}>


                      {/* ID */}

                      <td className="teacher-id-cell">
                        {teacher.teacher_id}
                      </td>


                      {/* NAME */}

                      <td>
                        <span className="teacher-name">
                          {teacher.name}
                        </span>
                      </td>


                      {/* DEPARTMENT */}

                      <td>
                        {teacher.department}
                      </td>


                      {/* DESIGNATION */}

                      <td>
                        {teacher.designation}
                      </td>


                      {/* EMAIL */}

                      <td>
                        {teacher.email}
                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-teacher-status ${
                            teacher.status === "active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {teacher.status}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="admin-teacher-actions">

                          <button
                            type="button"
                            className="teacher-edit-button"
                            onClick={() => handleEdit(teacher)}
                          >
                            Edit
                          </button>


                          <button
                            type="button"
                            className="teacher-delete-button"
                            onClick={() => handleDelete(teacher)}
                            disabled={
                              deletingId === teacher.teacher_id
                            }
                          >
                            {deletingId === teacher.teacher_id
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
                      colSpan="7"
                      className="admin-no-teachers"
                    >
                      No teachers found.
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

export default AdminTeachers;