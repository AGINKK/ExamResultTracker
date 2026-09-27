import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../services/api";
import "./AdminAnnouncements.css";

function AdminAnnouncements() {
  const [search, setSearch] = useState("");

  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    announcement_id: "",
    title: "",
    message: "",
    category: "Academic",
    audience: "students",
    published_date: "",
    status: "published",
    created_by: "ADM001",
  });

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);


  // =====================================================
  // LOAD ANNOUNCEMENTS
  // =====================================================

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAnnouncements();

      if (response.success) {
        setAnnouncements(response.data || []);
      } else {
        setError(response.message || "Failed to load announcements.");
      }
    } catch (err) {
      console.error("Load announcements error:", err);

      setError(
        err.message || "Failed to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadAnnouncements();
  }, []);


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      `${announcement.announcement_id}
       ${announcement.title}
       ${announcement.category}
       ${announcement.audience}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return date;
    }

    return formattedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  // =====================================================
  // VIEW ANNOUNCEMENT
  // =====================================================

  const handleView = async (announcement) => {
    try {
      setError("");

      const response = await getAnnouncementById(
        announcement.announcement_id
      );

      if (response.success) {
        setSelectedAnnouncement(response.data);
        setShowViewModal(true);
      } else {
        setError(
          response.message || "Failed to retrieve announcement."
        );
      }
    } catch (err) {
      console.error("View announcement error:", err);

      setError(
        err.message || "Failed to retrieve announcement."
      );
    }
  };


  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAdd = () => {
    setIsEditing(false);

    setFormData({
      announcement_id: "",
      title: "",
      message: "",
      category: "Academic",
      audience: "students",
      published_date: new Date()
        .toISOString()
        .split("T")[0],
      status: "published",
      created_by: "ADM001",
    });

    setError("");
    setSuccess("");

    setShowFormModal(true);
  };


  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = async (announcement) => {
    try {
      setError("");

      const response = await getAnnouncementById(
        announcement.announcement_id
      );

      if (response.success) {
        const data = response.data;

        setFormData({
          announcement_id: data.announcement_id || "",
          title: data.title || "",
          message: data.message || "",
          category: data.category || "Academic",
          audience: data.audience || "students",
          published_date: data.published_date
            ? new Date(data.published_date)
                .toISOString()
                .split("T")[0]
            : "",
          status: data.status || "published",
          created_by: data.created_by || "ADM001",
        });

        setIsEditing(true);
        setShowFormModal(true);
      } else {
        setError(
          response.message || "Failed to retrieve announcement."
        );
      }
    } catch (err) {
      console.error("Edit announcement error:", err);

      setError(
        err.message || "Failed to retrieve announcement."
      );
    }
  };


  // =====================================================
  // FORM INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =====================================================
  // ADD / UPDATE ANNOUNCEMENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      let response;

      if (isEditing) {
        response = await updateAnnouncement(
          formData.announcement_id,
          {
            title: formData.title,
            message: formData.message,
            category: formData.category,
            audience: formData.audience,
            published_date: formData.published_date,
            status: formData.status,
          }
        );
      } else {
        response = await createAnnouncement({
          announcement_id: formData.announcement_id,
          title: formData.title,
          message: formData.message,
          category: formData.category,
          audience: formData.audience,
          published_date: formData.published_date,
          status: formData.status,
          created_by: formData.created_by,
        });
      }

      if (!response.success) {
        setError(
          response.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } announcement.`
        );

        return;
      }

      setShowFormModal(false);

      setSuccess(
        isEditing
          ? "Announcement updated successfully."
          : "Announcement created successfully."
      );

      await loadAnnouncements();

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (err) {
      console.error("Save announcement error:", err);

      setError(
        err.message ||
          `Failed to ${
            isEditing ? "update" : "create"
          } announcement.`
      );
    } finally {
      setSubmitting(false);
    }
  };


  // =====================================================
  // OPEN DELETE CONFIRMATION
  // =====================================================

  const handleDeleteClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteModal(true);
    setError("");
    setSuccess("");
  };


  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const handleDeleteConfirm = async () => {
    if (!selectedAnnouncement) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await deleteAnnouncement(
        selectedAnnouncement.announcement_id
      );

      if (!response.success) {
        setError(
          response.message ||
            "Failed to delete announcement."
        );

        return;
      }

      setShowDeleteModal(false);
      setSelectedAnnouncement(null);

      setSuccess("Announcement deleted successfully.");

      await loadAnnouncements();

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (err) {
      console.error("Delete announcement error:", err);

      setError(
        err.message || "Failed to delete announcement."
      );
    } finally {
      setDeleting(false);
    }
  };


  // =====================================================
  // CLOSE MODALS
  // =====================================================

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedAnnouncement(null);
  };

  const closeFormModal = () => {
    if (!submitting) {
      setShowFormModal(false);
    }
  };

  const closeDeleteModal = () => {
    if (!deleting) {
      setShowDeleteModal(false);
      setSelectedAnnouncement(null);
    }
  };


  // =====================================================
  // JSX
  // =====================================================

  return (
    <AdminLayout>

      <div className="admin-announcements">

        {/* HEADER */}

        <section className="admin-announcements-header">

          <div>
            <h2>Announcements</h2>

            <p>
              Create and manage academic announcements for
              students and teachers.
            </p>
          </div>

          <button
            type="button"
            className="admin-announcements-primary-button"
            onClick={handleAdd}
          >
            Add Announcement
          </button>

        </section>


        {/* SUCCESS MESSAGE */}

        {success && (
          <div className="admin-announcements-message success">
            {success}
          </div>
        )}


        {/* ERROR MESSAGE */}

        {error && (
          <div className="admin-announcements-message error">
            {error}
          </div>
        )}


        {/* CONTENT */}

        <section className="admin-announcements-content">

          {/* SEARCH */}

          <div className="admin-announcements-search">

            <input
              type="text"
              placeholder="Search by ID, title, category, or audience..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>


          {/* TABLE */}

          <div className="admin-announcements-table-container">

            <table>

              <thead>
                <tr>
                  <th>Announcement ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Audience</th>
                  <th>Published Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>


              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="7"
                      className="admin-no-announcements"
                    >
                      Loading announcements...
                    </td>
                  </tr>

                ) : filteredAnnouncements.length > 0 ? (

                  filteredAnnouncements.map((announcement) => (

                    <tr
                      key={announcement.announcement_id}
                    >

                      <td>
                        {announcement.announcement_id}
                      </td>


                      <td className="admin-announcement-title">
                        {announcement.title}
                      </td>


                      <td>
                        {announcement.category}
                      </td>


                      <td>
                        {announcement.audience}
                      </td>


                      <td>
                        {formatDate(
                          announcement.published_date
                        )}
                      </td>


                      <td>

                        <span
                          className={`admin-announcement-status ${
                            String(
                              announcement.status
                            ).toLowerCase() ===
                            "published"
                              ? "published"
                              : "draft"
                          }`}
                        >
                          {announcement.status}
                        </span>

                      </td>


                      <td>

                        <div className="admin-announcement-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleView(announcement)
                            }
                          >
                            View
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(announcement)
                            }
                          >
                            Edit
                          </button>


                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleDeleteClick(
                                announcement
                              )
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
                      colSpan="7"
                      className="admin-no-announcements"
                    >
                      No announcements found.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* =================================================
            VIEW MODAL
        ================================================= */}

        {showViewModal && selectedAnnouncement && (

          <div className="admin-modal-overlay">

            <div className="admin-modal">

              <div className="admin-modal-header">

                <div>
                  <h3>Announcement Details</h3>

                  <p>
                    {selectedAnnouncement.announcement_id}
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={closeViewModal}
                >
                  ×
                </button>

              </div>


              <div className="admin-announcement-view">

                <div className="admin-view-field">
                  <span>Title</span>
                  <strong>
                    {selectedAnnouncement.title}
                  </strong>
                </div>


                <div className="admin-view-field">
                  <span>Category</span>
                  <strong>
                    {selectedAnnouncement.category}
                  </strong>
                </div>


                <div className="admin-view-field">
                  <span>Audience</span>
                  <strong>
                    {selectedAnnouncement.audience}
                  </strong>
                </div>


                <div className="admin-view-field">
                  <span>Published Date</span>
                  <strong>
                    {formatDate(
                      selectedAnnouncement.published_date
                    )}
                  </strong>
                </div>


                <div className="admin-view-field">
                  <span>Status</span>

                  <strong>
                    <span
                      className={`admin-announcement-status ${
                        String(
                          selectedAnnouncement.status
                        ).toLowerCase() === "published"
                          ? "published"
                          : "draft"
                      }`}
                    >
                      {selectedAnnouncement.status}
                    </span>
                  </strong>
                </div>


                <div className="admin-view-field full-width">
                  <span>Message</span>

                  <div className="admin-announcement-message-box">
                    {selectedAnnouncement.message}
                  </div>
                </div>


                {selectedAnnouncement.created_by_name && (

                  <div className="admin-view-field">
                    <span>Created By</span>

                    <strong>
                      {selectedAnnouncement.created_by_name}
                    </strong>
                  </div>

                )}

              </div>


              <div className="admin-modal-footer">

                <button
                  type="button"
                  className="admin-modal-secondary-button"
                  onClick={closeViewModal}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="admin-modal-primary-button"
                  onClick={() => {
                    closeViewModal();
                    handleEdit(selectedAnnouncement);
                  }}
                >
                  Edit Announcement
                </button>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            ADD / EDIT MODAL
        ================================================= */}

        {showFormModal && (

          <div className="admin-modal-overlay">

            <div className="admin-modal admin-form-modal">

              <div className="admin-modal-header">

                <div>
                  <h3>
                    {isEditing
                      ? "Edit Announcement"
                      : "Add Announcement"}
                  </h3>

                  <p>
                    {isEditing
                      ? "Update announcement information."
                      : "Create a new academic announcement."}
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={closeFormModal}
                  disabled={submitting}
                >
                  ×
                </button>

              </div>


              <form onSubmit={handleSubmit}>

                <div className="admin-announcement-form-grid">

                  {/* ANNOUNCEMENT ID */}

                  <div className="admin-form-group">

                    <label>
                      Announcement ID
                    </label>

                    <input
                      type="text"
                      name="announcement_id"
                      value={formData.announcement_id}
                      onChange={handleChange}
                      placeholder="Example: ANN005"
                      disabled={isEditing}
                      required
                    />

                  </div>


                  {/* CATEGORY */}

                  <div className="admin-form-group">

                    <label>
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="Academic">
                        Academic
                      </option>

                      <option value="Examination">
                        Examination
                      </option>

                      <option value="Faculty">
                        Faculty
                      </option>

                      <option value="General">
                        General
                      </option>

                      <option value="Results">
                        Results
                      </option>
                    </select>

                  </div>


                  {/* TITLE */}

                  <div className="admin-form-group full-width">

                    <label>
                      Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter announcement title"
                      required
                    />

                  </div>


                  {/* MESSAGE */}

                  <div className="admin-form-group full-width">

                    <label>
                      Message
                    </label>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter announcement message"
                      rows="5"
                      required
                    />

                  </div>


                  {/* AUDIENCE */}

                  <div className="admin-form-group">

                    <label>
                      Audience
                    </label>

                    <select
                      name="audience"
                      value={formData.audience}
                      onChange={handleChange}
                      required
                    >
                      <option value="students">
                        Students
                      </option>

                      <option value="teachers">
                        Teachers
                      </option>

                      <option value="students & teachers">
                        Students & Teachers
                      </option>
                    </select>

                  </div>


                  {/* DATE */}

                  <div className="admin-form-group">

                    <label>
                      Published Date
                    </label>

                    <input
                      type="date"
                      name="published_date"
                      value={formData.published_date}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* STATUS */}

                  <div className="admin-form-group">

                    <label>
                      Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="published">
                        Published
                      </option>

                      <option value="draft">
                        Draft
                      </option>
                    </select>

                  </div>

                </div>


                {/* FOOTER */}

                <div className="admin-modal-footer">

                  <button
                    type="button"
                    className="admin-modal-secondary-button"
                    onClick={closeFormModal}
                    disabled={submitting}
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="admin-modal-primary-button"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Saving..."
                      : isEditing
                      ? "Update Announcement"
                      : "Create Announcement"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}


        {/* =================================================
            DELETE CONFIRMATION MODAL
        ================================================= */}

        {showDeleteModal && selectedAnnouncement && (

          <div className="admin-modal-overlay">

            <div className="admin-modal admin-delete-modal">

              <div className="admin-modal-header">

                <div>
                  <h3>Delete Announcement</h3>

                  <p>
                    Please confirm this action.
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                >
                  ×
                </button>

              </div>


              <div className="admin-delete-content">

                <p>
                  Are you sure you want to delete this
                  announcement?
                </p>

                <strong>
                  {selectedAnnouncement.title}
                </strong>

                <small>
                  Announcement ID:{" "}
                  {selectedAnnouncement.announcement_id}
                </small>

              </div>


              <div className="admin-modal-footer">

                <button
                  type="button"
                  className="admin-modal-secondary-button"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="admin-modal-delete-button"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete Announcement"}
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </AdminLayout>
  );
}

export default AdminAnnouncements;