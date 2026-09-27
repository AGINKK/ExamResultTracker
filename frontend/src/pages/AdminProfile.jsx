import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import "./AdminProfile.css";

import {
  getMyProfile,
  updateMyProfile
} from "../services/api";

function AdminProfile() {

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    loadProfile();
  }, []);


  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyProfile();

      if (response.success) {

        setProfile(response.data);

        setFormData({
          name: response.data.name || "",
          email: response.data.email || ""
        });

      } else {

        setError(
          response.message || "Failed to load profile."
        );

      }

    } catch (error) {

      console.error("Profile loading error:", error);

      setError(
        error.message || "Failed to load profile."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  // =====================================================
  // START EDIT
  // =====================================================

  const handleEdit = () => {

    setSuccess("");
    setError("");

    setFormData({
      name: profile.name || "",
      email: profile.email || ""
    });

    setEditMode(true);

  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {

    setSuccess("");
    setError("");

    setFormData({
      name: profile.name || "",
      email: profile.email || ""
    });

    setEditMode(false);

  };


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.email.trim()) {

      setError("Name and email are required.");

      return;
    }

    try {

      setSaving(true);

      const response = await updateMyProfile({
        name: formData.name.trim(),
        email: formData.email.trim()
      });

      if (response.success) {

        setSuccess(
          response.message || "Profile updated successfully."
        );

        setEditMode(false);

        await loadProfile();

      } else {

        setError(
          response.message || "Failed to update profile."
        );

      }

    } catch (error) {

      console.error("Profile update error:", error);

      setError(
        error.message || "Failed to update profile."
      );

    } finally {

      setSaving(false);

    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <AdminLayout>

        <div className="admin-profile">

          <section className="admin-profile-intro">

            <h2>Admin Profile</h2>

            <p>
              View your administrative and account information.
            </p>

          </section>

          <div className="admin-profile-message">

            Loading profile...

          </div>

        </div>

      </AdminLayout>
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error && !profile) {

    return (
      <AdminLayout>

        <div className="admin-profile">

          <section className="admin-profile-intro">

            <h2>Admin Profile</h2>

            <p>
              View your administrative and account information.
            </p>

          </section>

          <div className="admin-profile-error">

            {error}

          </div>

          <button
            type="button"
            className="admin-profile-retry-button"
            onClick={loadProfile}
          >
            Try Again
          </button>

        </div>

      </AdminLayout>
    );

  }


  // =====================================================
  // MAIN PROFILE
  // =====================================================

  return (

    <AdminLayout>

      <div className="admin-profile">

        {/* =================================================
            INTRO
        ================================================= */}

        <section className="admin-profile-intro">

          <div>

            <h2>Admin Profile</h2>

            <p>
              View and manage your administrative account information.
            </p>

          </div>

          {!editMode && (
            <button
              type="button"
              className="admin-profile-edit-button"
              onClick={handleEdit}
            >
              Edit Profile
            </button>
          )}

        </section>


        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {success && (

          <div className="admin-profile-success">

            {success}

          </div>

        )}


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && profile && (

          <div className="admin-profile-error">

            {error}

          </div>

        )}


        {/* =================================================
            EDIT FORM
        ================================================= */}

        {editMode ? (

          <form
            className="admin-profile-card"
            onSubmit={handleSave}
          >

            <div className="admin-profile-card-header">

              <h3>Personal Information</h3>

              <span className="admin-profile-edit-label">
                Editing
              </span>

            </div>


            <div className="admin-profile-form">

              {/* NAME */}

              <div className="admin-profile-form-group">

                <label htmlFor="name">
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="admin-profile-form-group">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />

              </div>

            </div>


            <div className="admin-profile-form-actions">

              <button
                type="button"
                className="admin-profile-cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-profile-save-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </form>

        ) : (

          /* =================================================
             VIEW MODE
          ================================================= */

          <>

            {/* PERSONAL INFORMATION */}

            <section className="admin-profile-card">

              <h3>Personal Information</h3>

              <div className="admin-profile-grid">

                <div className="admin-profile-item">

                  <span>Name</span>

                  <strong>
                    {profile?.name || "Not available"}
                  </strong>

                </div>


                <div className="admin-profile-item">

                  <span>Email</span>

                  <strong>
                    {profile?.email || "Not available"}
                  </strong>

                </div>


                <div className="admin-profile-item">

                  <span>Role</span>

                  <strong>
                    Administrator
                  </strong>

                </div>


                <div className="admin-profile-item">

                  <span>Account Status</span>

                  <strong
                    className={
                      profile?.status === "active"
                        ? "admin-profile-active"
                        : "admin-profile-inactive"
                    }
                  >
                    {profile?.status || "Unknown"}
                  </strong>

                </div>

              </div>

            </section>


            {/* ADMINISTRATIVE INFORMATION */}

            <section className="admin-profile-card">

              <h3>Administrative Information</h3>

              <div className="admin-profile-grid">

                <div className="admin-profile-item">

                  <span>Admin ID</span>

                  <strong>
                    {profile?.user_id || "Not available"}
                  </strong>

                </div>


                <div className="admin-profile-item">

                  <span>Access Level</span>

                  <strong>
                    Full Access
                  </strong>

                </div>


                <div className="admin-profile-item">

                  <span>User Role</span>

                  <strong>
                    {profile?.role || "admin"}
                  </strong>

                </div>


                <div className="admin-profile-item">

                  <span>Account Created</span>

                  <strong>
                    {profile?.created_at
                      ? new Date(
                          profile.created_at
                        ).toLocaleDateString()
                      : "Not available"}
                  </strong>

                </div>

              </div>

            </section>

          </>

        )}

      </div>

    </AdminLayout>

  );
}

export default AdminProfile;