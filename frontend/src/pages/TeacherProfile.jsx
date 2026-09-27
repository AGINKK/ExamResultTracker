import { useEffect, useState } from "react";
import TeacherLayout from "../layouts/TeacherLayout";
import { apiGet, updateMyProfile } from "../services/api";
import "./TeacherProfile.css";

function TeacherProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
    user_id: "",
    created_at: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiGet("/api/users/me");

      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.message || "Failed to load profile.");
      }
    } catch (err) {
      console.error("Load teacher profile error:", err);
      setError(err.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!profile.name.trim() || !profile.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setSaving(true);

      const response = await updateMyProfile({
        name: profile.name,
        email: profile.email,
      });

      if (response.success) {
        setSuccess("Profile updated successfully.");
      } else {
        setError(response.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Update teacher profile error:", err);
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <TeacherLayout>
        <div className="teacher-profile">
          <section className="teacher-profile-intro">
            <h2>Teacher Profile</h2>
            <p>Loading profile...</p>
          </section>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="teacher-profile">

        {/* HEADER */}
        <section className="teacher-profile-intro">
          <h2>Teacher Profile</h2>
          <p>
            View and update your personal information.
          </p>
        </section>

        {/* MESSAGES */}
        {error && (
          <div className="teacher-profile-message teacher-profile-error">
            {error}
          </div>
        )}

        {success && (
          <div className="teacher-profile-message teacher-profile-success">
            {success}
          </div>
        )}

        {/* PROFILE FORM */}
        <section className="teacher-profile-card">

          <h3>Personal Information</h3>

          <form
            className="teacher-profile-form"
            onSubmit={handleSave}
          >

            <div className="teacher-profile-form-grid">

              <div className="teacher-profile-form-group">
                <label htmlFor="name">
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="teacher-profile-form-group">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

            </div>

            <button
              type="submit"
              className="teacher-profile-save"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

          </form>

        </section>

        {/* ACCOUNT INFORMATION */}
        <section className="teacher-profile-card">

          <h3>Account Information</h3>

          <div className="teacher-profile-form-grid">

            <div className="teacher-profile-item">
              <span>User ID</span>
              <strong>
                {profile.user_id || "Not available"}
              </strong>
            </div>

            <div className="teacher-profile-item">
              <span>Role</span>
              <strong>
                {profile.role || "Teacher"}
              </strong>
            </div>

            <div className="teacher-profile-item">
              <span>Status</span>
              <strong>
                {profile.status || "Not available"}
              </strong>
            </div>

            <div className="teacher-profile-item">
              <span>Created Date</span>
              <strong>
                {profile.created_at
                  ? new Date(
                      profile.created_at
                    ).toLocaleDateString()
                  : "Not available"}
              </strong>
            </div>

          </div>

        </section>

      </div>
    </TeacherLayout>
  );
}

export default TeacherProfile;