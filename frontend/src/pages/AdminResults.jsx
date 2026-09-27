import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  getResults,
  getResultById,
  updateResult,
  deleteResult,
} from "../services/api";
import "./AdminResults.css";

function AdminResults() {
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("All");

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [viewResult, setViewResult] = useState(null);

  const [editResult, setEditResult] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ================================
  // LOAD RESULTS
  // ================================

  const loadResults = async () => {
    try {
      setLoading(true);

      const response = await getResults();

      if (response.success) {
        setResults(response.data || []);
      } else {
        showMessage(
          response.message || "Failed to load results.",
          "error"
        );
      }
    } catch (error) {
      console.error("Load results error:", error);

      showMessage(
        error.message || "Failed to load results.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  // ================================
  // MESSAGE
  // ================================

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  // ================================
  // EXAM FILTER
  // ================================

  const exams = [
    "All",
    ...new Set(
      results
        .map((result) => result.exam_name)
        .filter(Boolean)
    ),
  ];

  // ================================
  // SEARCH + FILTER
  // ================================

  const filteredResults = results.filter((result) => {
    const searchText = `
      ${result.result_id || ""}
      ${result.student_id || ""}
      ${result.student_code || ""}
      ${result.student_name || ""}
      ${result.subject_code || ""}
      ${result.subject_name || ""}
      ${result.exam_name || ""}
    `.toLowerCase();

    const matchesSearch = searchText.includes(
      search.toLowerCase()
    );

    const matchesExam =
      examFilter === "All" ||
      result.exam_name === examFilter;

    return matchesSearch && matchesExam;
  });

  // ================================
  // VIEW RESULT
  // ================================

  const handleView = async (result) => {
    try {
      const response = await getResultById(result.result_id);

      if (response.success) {
        setViewResult(response.data);
      } else {
        showMessage(
          response.message || "Failed to load result.",
          "error"
        );
      }
    } catch (error) {
      console.error("View result error:", error);

      showMessage(
        error.message || "Failed to load result.",
        "error"
      );
    }
  };

  // ================================
  // OPEN EDIT
  // ================================

  const handleEdit = async (result) => {
    try {
      const response = await getResultById(result.result_id);

      if (response.success) {
        setEditResult(response.data);
      } else {
        showMessage(
          response.message || "Failed to load result.",
          "error"
        );
      }
    } catch (error) {
      console.error("Edit result error:", error);

      showMessage(
        error.message || "Failed to load result.",
        "error"
      );
    }
  };

  // ================================
  // EDIT INPUT CHANGE
  // ================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditResult((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================================
  // SAVE EDIT
  // ================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editResult) return;

    try {
      setSaving(true);

      const response = await updateResult(
        editResult.result_id,
        {
          student_id: editResult.student_id,
          exam_id: editResult.exam_id,
          subject_id: editResult.subject_id,
          marks_obtained: editResult.marks_obtained,
          max_marks: editResult.max_marks,
          grade: editResult.grade,
          status: editResult.status,
        }
      );

      if (response.success) {
        setEditResult(null);

        showMessage(
          response.message || "Result updated successfully.",
          "success"
        );

        await loadResults();
      } else {
        showMessage(
          response.message || "Failed to update result.",
          "error"
        );
      }
    } catch (error) {
      console.error("Update result error:", error);

      showMessage(
        error.message || "Failed to update result.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // OPEN DELETE CONFIRMATION
  // ================================

  const handleDelete = (result) => {
    setDeleteTarget(result);
  };

  // ================================
  // CONFIRM DELETE
  // ================================

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      const response = await deleteResult(
        deleteTarget.result_id
      );

      if (response.success) {
        setDeleteTarget(null);

        showMessage(
          response.message || "Result deleted successfully.",
          "success"
        );

        await loadResults();
      } else {
        showMessage(
          response.message || "Failed to delete result.",
          "error"
        );
      }
    } catch (error) {
      console.error("Delete result error:", error);

      showMessage(
        error.message || "Failed to delete result.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-results">

        {/* ================================
            HEADER
        ================================= */}

        <section className="admin-results-header">
          <div>
            <h2>Results</h2>

            <p>
              View and manage student examination results.
            </p>
          </div>
        </section>

        {/* ================================
            MESSAGE
        ================================= */}

        {message && (
          <div
            className={`admin-results-message ${messageType}`}
          >
            {message}
          </div>
        )}

        {/* ================================
            CONTENT
        ================================= */}

        <section className="admin-results-content">

          {/* FILTERS */}

          <div className="admin-results-filters">

            <div className="admin-results-search">
              <input
                type="text"
                placeholder="Search by result ID, student, or subject..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="admin-results-filter">
              <select
                value={examFilter}
                onChange={(e) =>
                  setExamFilter(e.target.value)
                }
              >
                {exams.map((exam) => (
                  <option
                    key={exam}
                    value={exam}
                  >
                    {exam}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* TABLE */}

          <div className="admin-results-table-container">
            <table>

              <thead>
                <tr>
                  <th>Result ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Exam</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="admin-no-results"
                    >
                      Loading results...
                    </td>
                  </tr>
                ) : filteredResults.length > 0 ? (

                  filteredResults.map((result) => (

                    <tr key={result.result_id}>

                      <td>
                        {result.result_id}
                      </td>

                      <td>
                        <strong>
                          {result.student_name || "Unknown Student"}
                        </strong>

                        <small>
                          {result.student_code ||
                            result.student_id}
                        </small>
                      </td>

                      <td>
                        MCA
                      </td>

                      <td>
                        {result.subject_name ||
                          result.subject_code ||
                          "-"}
                      </td>

                      <td>
                        {result.marks_obtained}
                        {" / "}
                        {result.max_marks}
                      </td>

                      <td>
                        <span className="admin-result-grade">
                          {result.grade}
                        </span>
                      </td>

                      <td>
                        {result.exam_name || "-"}
                      </td>

                      <td>
                        <span
                          className={`admin-result-status ${
                            String(result.status).toLowerCase() ===
                            "published"
                              ? "published"
                              : "pending"
                          }`}
                        >
                          {result.status}
                        </span>
                      </td>

                      <td>

                        <div className="admin-result-actions">

                          <button
                            type="button"
                            className="view-button"
                            onClick={() =>
                              handleView(result)
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              handleEdit(result)
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleDelete(result)
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
                      colSpan="9"
                      className="admin-no-results"
                    >
                      No results found.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>
          </div>

        </section>

        {/* =================================================
            VIEW RESULT MODAL
        ================================================= */}

        {viewResult && (

          <div
            className="admin-result-modal-overlay"
            onClick={() => setViewResult(null)}
          >

            <div
              className="admin-result-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="admin-result-modal-header">

                <div>
                  <h3>Result Details</h3>

                  <p>
                    {viewResult.result_id}
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close-button"
                  onClick={() =>
                    setViewResult(null)
                  }
                >
                  ×
                </button>

              </div>

              <div className="admin-result-details">

                <div className="result-detail-item">
                  <span>Result ID</span>
                  <strong>
                    {viewResult.result_id}
                  </strong>
                </div>

                <div className="result-detail-item">
                  <span>Student ID</span>
                  <strong>
                    {viewResult.student_code ||
                      viewResult.student_id}
                  </strong>
                </div>

                <div className="result-detail-item">
                  <span>Student Name</span>
                  <strong>
                    {viewResult.student_name ||
                      "Unknown Student"}
                  </strong>
                </div>

                <div className="result-detail-item">
                  <span>Exam</span>
                  <strong>
                    {viewResult.exam_name || "-"}
                  </strong>
                </div>

                <div className="result-detail-item">
                  <span>Subject</span>
                  <strong>
                    {viewResult.subject_name ||
                      viewResult.subject_code ||
                      "-"}
                  </strong>
                </div>

                <div className="result-detail-item">
                  <span>Marks</span>
                  <strong>
                    {viewResult.marks_obtained}
                    {" / "}
                    {viewResult.max_marks}
                  </strong>
                </div>

                <div className="result-detail-item">
                  <span>Grade</span>
                  <strong>
                    {viewResult.grade}
                  </strong>
                </div>

                <div className="result-detail-item">
                  <span>Status</span>
                  <strong>
                    {viewResult.status}
                  </strong>
                </div>

              </div>

              <div className="admin-result-modal-footer">

                <button
                  type="button"
                  onClick={() =>
                    setViewResult(null)
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            EDIT RESULT MODAL
        ================================================= */}

        {editResult && (

          <div
            className="admin-result-modal-overlay"
            onClick={() => setEditResult(null)}
          >

            <div
              className="admin-result-modal edit-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="admin-result-modal-header">

                <div>
                  <h3>Edit Result</h3>

                  <p>
                    {editResult.result_id}
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close-button"
                  onClick={() =>
                    setEditResult(null)
                  }
                >
                  ×
                </button>

              </div>

              <form
                onSubmit={handleUpdate}
                className="admin-result-edit-form"
              >

                {/* Result ID */}

                <div className="form-group">

                  <label>
                    Result ID
                  </label>

                  <input
                    type="text"
                    value={editResult.result_id || ""}
                    disabled
                  />

                </div>

                {/* Student ID */}

                <div className="form-group">

                  <label>
                    Student ID
                  </label>

                  <input
                    type="text"
                    name="student_id"
                    value={editResult.student_id || ""}
                    onChange={handleEditChange}
                    required
                  />

                </div>

                {/* Exam ID */}

                <div className="form-group">

                  <label>
                    Exam ID
                  </label>

                  <input
                    type="text"
                    name="exam_id"
                    value={editResult.exam_id || ""}
                    onChange={handleEditChange}
                    required
                  />

                </div>

                {/* Subject ID */}

                <div className="form-group">

                  <label>
                    Subject ID
                  </label>

                  <input
                    type="text"
                    name="subject_id"
                    value={editResult.subject_id || ""}
                    onChange={handleEditChange}
                    required
                  />

                </div>

                {/* Marks */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Marks Obtained
                    </label>

                    <input
                      type="number"
                      name="marks_obtained"
                      value={
                        editResult.marks_obtained ?? ""
                      }
                      onChange={handleEditChange}
                      min="0"
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Maximum Marks
                    </label>

                    <input
                      type="number"
                      name="max_marks"
                      value={
                        editResult.max_marks ?? ""
                      }
                      onChange={handleEditChange}
                      min="1"
                      required
                    />

                  </div>

                </div>

                {/* Grade + Status */}

                <div className="form-row">

                  <div className="form-group">

                    <label>
                      Grade
                    </label>

                    <input
                      type="text"
                      name="grade"
                      value={editResult.grade || ""}
                      onChange={handleEditChange}
                      required
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Status
                    </label>

                    <select
                      name="status"
                      value={editResult.status || ""}
                      onChange={handleEditChange}
                    >
                      <option value="Pass">
                        Pass
                      </option>

                      <option value="Fail">
                        Fail
                      </option>

                      <option value="Published">
                        Published
                      </option>

                      <option value="Pending">
                        Pending
                      </option>
                    </select>

                  </div>

                </div>

                {/* Buttons */}

                <div className="admin-result-modal-footer">

                  <button
                    type="button"
                    onClick={() =>
                      setEditResult(null)
                    }
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-result-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* =================================================
            DELETE CONFIRMATION
        ================================================= */}

        {deleteTarget && (

          <div
            className="admin-result-modal-overlay"
            onClick={() =>
              !deleting && setDeleteTarget(null)
            }
          >

            <div
              className="admin-result-modal delete-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="delete-icon">
                !
              </div>

              <h3>
                Delete Result?
              </h3>

              <p>
                Are you sure you want to delete result{" "}
                <strong>
                  {deleteTarget.result_id}
                </strong>
                ?
              </p>

              <p className="delete-warning">
                This action cannot be undone.
              </p>

              <div className="admin-result-modal-footer">

                <button
                  type="button"
                  onClick={() =>
                    setDeleteTarget(null)
                  }
                  disabled={deleting}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="confirm-delete-button"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete Result"}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default AdminResults;