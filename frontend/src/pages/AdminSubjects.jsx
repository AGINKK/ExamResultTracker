import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";

import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getCourses,
} from "../services/api";

import "./AdminSubjects.css";

function AdminSubjects() {
  // =====================================================
  // SUBJECT DATA
  // =====================================================

  const [subjects, setSubjects] = useState([]);

  // =====================================================
  // COURSE DATA
  // =====================================================

  const [courses, setCourses] = useState([]);

  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // LOADING / ERROR
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // ADD FORM
  // =====================================================

  const [showAddForm, setShowAddForm] = useState(false);

  const [addForm, setAddForm] = useState({
    subject_id: "",
    subject_code: "",
    subject_name: "",
    course_id: "",
    semester: "",
    credits: "",
    status: "active",
  });

  const [addLoading, setAddLoading] = useState(false);

  // =====================================================
  // EDIT FORM
  // =====================================================

  const [showEditForm, setShowEditForm] = useState(false);

  const [editingSubject, setEditingSubject] = useState(null);

  const [editLoading, setEditLoading] = useState(false);

  // =====================================================
  // DELETE LOADING
  // =====================================================

  const [deletingId, setDeletingId] = useState(null);

  // =====================================================
  // LOAD SUBJECTS
  // =====================================================

  const loadSubjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSubjects();

      if (response.success) {
        setSubjects(response.data || []);
      } else {
        setError(
          response.message || "Failed to load subjects."
        );
      }
    } catch (error) {
      console.error("Load subjects error:", error);

      setError(
        "Unable to load subjects from the server."
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
      } else {
        console.error(
          "Failed to load courses:",
          response.message
        );
      }
    } catch (error) {
      console.error("Load courses error:", error);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadSubjects();
    loadCourses();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredSubjects = subjects.filter((subject) => {
    const searchText = `
      ${subject.subject_id}
      ${subject.subject_code}
      ${subject.subject_name}
      ${subject.course_id}
      ${subject.course_name || ""}
      ${subject.semester}
      ${subject.credits}
      ${subject.status}
    `.toLowerCase();

    return searchText.includes(
      search.toLowerCase()
    );
  });

  // =====================================================
  // ADD SUBJECT - OPEN FORM
  // =====================================================

  const handleAddSubject = () => {
    setError("");

    setAddForm({
      subject_id: "",
      subject_code: "",
      subject_name: "",
      course_id: "",
      semester: "",
      credits: "",
      status: "active",
    });

    setShowAddForm(true);

    setShowEditForm(false);
    setEditingSubject(null);
  };

  // =====================================================
  // ADD FORM CHANGE
  // =====================================================

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;

    setAddForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // CREATE SUBJECT
  // =====================================================

  const handleCreateSubject = async (e) => {
    e.preventDefault();

    if (
      !addForm.subject_id ||
      !addForm.subject_code ||
      !addForm.subject_name ||
      !addForm.course_id ||
      !addForm.semester ||
      !addForm.credits
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setAddLoading(true);

      const response = await createSubject({
        subject_id: addForm.subject_id.trim(),
        subject_code: addForm.subject_code.trim(),
        subject_name: addForm.subject_name.trim(),
        course_id: addForm.course_id,
        semester: Number(addForm.semester),
        credits: Number(addForm.credits),
        status: addForm.status,
      });

      if (response.success) {
        alert("Subject created successfully.");

        setShowAddForm(false);

        setAddForm({
          subject_id: "",
          subject_code: "",
          subject_name: "",
          course_id: "",
          semester: "",
          credits: "",
          status: "active",
        });

        await loadSubjects();
      } else {
        alert(
          response.message ||
            "Unable to create subject."
        );
      }
    } catch (error) {
      console.error(
        "Create subject error:",
        error
      );

      alert(
        "Unable to create subject."
      );
    } finally {
      setAddLoading(false);
    }
  };

  // =====================================================
  // EDIT SUBJECT - OPEN FORM
  // =====================================================

  const handleEdit = (subject) => {
    setError("");

    setShowAddForm(false);

    setEditingSubject({
      subject_id: subject.subject_id,
      subject_code: subject.subject_code || "",
      subject_name: subject.subject_name || "",
      course_id: subject.course_id || "",
      semester: subject.semester || "",
      credits: subject.credits || "",
      status: subject.status || "active",
    });

    setShowEditForm(true);
  };

  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    setEditingSubject((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // UPDATE SUBJECT
  // =====================================================

  const handleUpdateSubject = async (e) => {
    e.preventDefault();

    if (!editingSubject) {
      return;
    }

    if (
      !editingSubject.subject_code ||
      !editingSubject.subject_name ||
      !editingSubject.course_id ||
      !editingSubject.semester ||
      !editingSubject.credits
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setEditLoading(true);

      const response = await updateSubject(
        editingSubject.subject_id,
        {
          subject_code:
            editingSubject.subject_code.trim(),

          subject_name:
            editingSubject.subject_name.trim(),

          course_id:
            editingSubject.course_id,

          semester:
            Number(editingSubject.semester),

          credits:
            Number(editingSubject.credits),

          status:
            editingSubject.status,
        }
      );

      if (response.success) {
        alert("Subject updated successfully.");

        setShowEditForm(false);
        setEditingSubject(null);

        await loadSubjects();
      } else {
        alert(
          response.message ||
            "Unable to update subject."
        );
      }
    } catch (error) {
      console.error(
        "Update subject error:",
        error
      );

      alert(
        "Unable to update subject."
      );
    } finally {
      setEditLoading(false);
    }
  };

  // =====================================================
  // DELETE SUBJECT
  // =====================================================

  const handleDelete = async (subject) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${subject.subject_name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(subject.subject_id);

      const response = await deleteSubject(
        subject.subject_id
      );

      if (response.success) {
        alert("Subject deleted successfully.");

        await loadSubjects();
      } else {
        alert(
          response.message ||
            "Unable to delete subject."
        );
      }
    } catch (error) {
      console.error(
        "Delete subject error:",
        error
      );

      alert(
        "Unable to delete subject."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // CLOSE ADD FORM
  // =====================================================

  const closeAddForm = () => {
    setShowAddForm(false);

    setAddForm({
      subject_id: "",
      subject_code: "",
      subject_name: "",
      course_id: "",
      semester: "",
      credits: "",
      status: "active",
    });
  };

  // =====================================================
  // CLOSE EDIT FORM
  // =====================================================

  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingSubject(null);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <AdminLayout>

      <div className="admin-subjects">

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="admin-subjects-header">

          <div>
            <h2>Subjects</h2>

            <p>
              Create and manage subjects assigned to
              academic courses.
            </p>
          </div>

          <button
            type="button"
            className="admin-subjects-primary-button"
            onClick={handleAddSubject}
          >
            Add Subject
          </button>

        </section>


        {/* =================================================
            ADD SUBJECT FORM
        ================================================= */}

        {showAddForm && (

          <section className="admin-subjects-content">

            <div className="admin-subject-edit-header">

              <div>
                <h3>Add Subject</h3>

                <p>
                  Enter the details of the new subject.
                </p>
              </div>

            </div>


            <form onSubmit={handleCreateSubject}>

              <div className="admin-subject-edit-grid">

                {/* Subject ID */}

                <div className="admin-subject-form-group">

                  <label>
                    Subject ID
                  </label>

                  <input
                    type="text"
                    name="subject_id"
                    placeholder="Example: SUB006"
                    value={addForm.subject_id}
                    onChange={handleAddFormChange}
                    required
                  />

                </div>


                {/* Subject Code */}

                <div className="admin-subject-form-group">

                  <label>
                    Subject Code
                  </label>

                  <input
                    type="text"
                    name="subject_code"
                    placeholder="Example: MCA601"
                    value={addForm.subject_code}
                    onChange={handleAddFormChange}
                    required
                  />

                </div>


                {/* Subject Name */}

                <div className="admin-subject-form-group">

                  <label>
                    Subject Name
                  </label>

                  <input
                    type="text"
                    name="subject_name"
                    placeholder="Example: Artificial Intelligence"
                    value={addForm.subject_name}
                    onChange={handleAddFormChange}
                    required
                  />

                </div>


                {/* Course */}

                <div className="admin-subject-form-group">

                  <label>
                    Course
                  </label>

                  <select
                    name="course_id"
                    value={addForm.course_id}
                    onChange={handleAddFormChange}
                    required
                  >

                    <option value="">
                      Select Course
                    </option>

                    {courses.map((course) => (

                      <option
                        key={course.course_id}
                        value={course.course_id}
                      >
                        {course.course_name}
                        {" - "}
                        {course.course_id}
                      </option>

                    ))}

                  </select>

                </div>


                {/* Semester */}

                <div className="admin-subject-form-group">

                  <label>
                    Semester
                  </label>

                  <input
                    type="number"
                    name="semester"
                    min="1"
                    max="10"
                    placeholder="Example: 4"
                    value={addForm.semester}
                    onChange={handleAddFormChange}
                    required
                  />

                </div>


                {/* Credits */}

                <div className="admin-subject-form-group">

                  <label>
                    Credits
                  </label>

                  <input
                    type="number"
                    name="credits"
                    min="1"
                    max="20"
                    placeholder="Example: 4"
                    value={addForm.credits}
                    onChange={handleAddFormChange}
                    required
                  />

                </div>


                {/* Status */}

                <div className="admin-subject-form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={addForm.status}
                    onChange={handleAddFormChange}
                  >

                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>

                  </select>

                </div>

              </div>


              {/* Add Buttons */}

              <div className="admin-subject-form-actions">

                <button
                  type="button"
                  className="admin-subject-cancel-button"
                  onClick={closeAddForm}
                  disabled={addLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-subject-update-button"
                  disabled={addLoading}
                >
                  {addLoading
                    ? "Creating..."
                    : "Save Subject"}
                </button>

              </div>

            </form>

          </section>

        )}


        {/* =================================================
            EDIT SUBJECT FORM
        ================================================= */}

        {showEditForm && editingSubject && (

          <section className="admin-subjects-content">

            <div className="admin-subject-edit-header">

              <div>

                <h3>
                  Edit Subject
                </h3>

                <p>
                  Update the selected subject details.
                </p>

              </div>

            </div>


            <form onSubmit={handleUpdateSubject}>

              <div className="admin-subject-edit-grid">

                {/* Subject ID */}

                <div className="admin-subject-form-group">

                  <label>
                    Subject ID
                  </label>

                  <input
                    type="text"
                    value={editingSubject.subject_id}
                    readOnly
                  />

                </div>


                {/* Subject Code */}

                <div className="admin-subject-form-group">

                  <label>
                    Subject Code
                  </label>

                  <input
                    type="text"
                    name="subject_code"
                    value={editingSubject.subject_code}
                    onChange={handleEditFormChange}
                    required
                  />

                </div>


                {/* Subject Name */}

                <div className="admin-subject-form-group">

                  <label>
                    Subject Name
                  </label>

                  <input
                    type="text"
                    name="subject_name"
                    value={editingSubject.subject_name}
                    onChange={handleEditFormChange}
                    required
                  />

                </div>


                {/* Course */}

                <div className="admin-subject-form-group">

                  <label>
                    Course
                  </label>

                  <select
                    name="course_id"
                    value={editingSubject.course_id}
                    onChange={handleEditFormChange}
                    required
                  >

                    <option value="">
                      Select Course
                    </option>

                    {courses.map((course) => (

                      <option
                        key={course.course_id}
                        value={course.course_id}
                      >
                        {course.course_name}
                        {" - "}
                        {course.course_id}
                      </option>

                    ))}

                  </select>

                </div>


                {/* Semester */}

                <div className="admin-subject-form-group">

                  <label>
                    Semester
                  </label>

                  <input
                    type="number"
                    name="semester"
                    min="1"
                    max="10"
                    value={editingSubject.semester}
                    onChange={handleEditFormChange}
                    required
                  />

                </div>


                {/* Credits */}

                <div className="admin-subject-form-group">

                  <label>
                    Credits
                  </label>

                  <input
                    type="number"
                    name="credits"
                    min="1"
                    max="20"
                    value={editingSubject.credits}
                    onChange={handleEditFormChange}
                    required
                  />

                </div>


                {/* Status */}

                <div className="admin-subject-form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={editingSubject.status}
                    onChange={handleEditFormChange}
                  >

                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>

                  </select>

                </div>

              </div>


              {/* Edit Buttons */}

              <div className="admin-subject-form-actions">

                <button
                  type="button"
                  className="admin-subject-cancel-button"
                  onClick={closeEditForm}
                  disabled={editLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-subject-update-button"
                  disabled={editLoading}
                >
                  {editLoading
                    ? "Updating..."
                    : "Update Subject"}
                </button>

              </div>

            </form>

          </section>

        )}


        {/* =================================================
            SUBJECT TABLE
        ================================================= */}

        <section className="admin-subjects-content">

          {/* Search */}

          <div className="admin-subjects-search">

            <input
              type="text"
              placeholder="Search by ID, code, subject, course, semester, or status..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* Table */}

          <div className="admin-subjects-table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Subject ID
                  </th>

                  <th>
                    Subject Code
                  </th>

                  <th>
                    Subject Name
                  </th>

                  <th>
                    Course
                  </th>

                  <th>
                    Semester
                  </th>

                  <th>
                    Credits
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {/* Loading */}

                {loading ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="admin-no-subjects"
                    >
                      Loading subjects...
                    </td>

                  </tr>

                ) : error ? (

                  /* Error */

                  <tr>

                    <td
                      colSpan="8"
                      className="admin-no-subjects"
                    >
                      {error}
                    </td>

                  </tr>

                ) : filteredSubjects.length > 0 ? (

                  /* Subjects */

                  filteredSubjects.map((subject) => (

                    <tr
                      key={subject.subject_id}
                    >

                      <td>
                        {subject.subject_id}
                      </td>

                      <td>
                        {subject.subject_code}
                      </td>

                      <td>
                        {subject.subject_name}
                      </td>

                      <td>
                        {subject.course_name
                          ? `${subject.course_name} (${subject.course_id})`
                          : subject.course_id}
                      </td>

                      <td>
                        Semester {subject.semester}
                      </td>

                      <td>
                        {subject.credits}
                      </td>

                      <td>

                        <span
                          className={`admin-subject-status ${
                            String(subject.status).toLowerCase() ===
                            "active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          {subject.status}
                        </span>

                      </td>

                      <td>

                        <div className="admin-subject-actions">

                          {/* Edit */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(subject)
                            }
                          >
                            Edit
                          </button>


                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(subject)
                            }
                            disabled={
                              deletingId ===
                              subject.subject_id
                            }
                          >
                            {deletingId ===
                            subject.subject_id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  /* No Subjects */

                  <tr>

                    <td
                      colSpan="8"
                      className="admin-no-subjects"
                    >
                      No subjects found.
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

export default AdminSubjects;