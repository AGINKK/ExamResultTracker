import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { getMyProfile } from "../services/api";
import "./AdminSettings.css";

function AdminSettings() {
  const [profile, setProfile] = useState(null);

  const [emailNotifications, setEmailNotifications] = useState(() => {
    const saved = localStorage.getItem("adminEmailNotifications");
    return saved === null ? true : saved === "true";
  });

  const [resultNotifications, setResultNotifications] = useState(() => {
    const saved = localStorage.getItem("adminResultNotifications");
    return saved === null ? true : saved === "true";
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // LOAD CURRENT ADMIN PROFILE
  // =====================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyProfile();

        if (response?.success) {
          setProfile(response.data);
        } else {
          setError(
            response?.message || "Failed to load account information."
          );
        }
      } catch (err) {
        console.error("Load settings profile error:", err);

        setError(
          err?.message || "Failed to load account information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSave = () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      localStorage.setItem(
        "adminEmailNotifications",
        String(emailNotifications)
      );

      localStorage.setItem(
        "adminResultNotifications",
        String(resultNotifications)
      );

      setMessage("Settings saved successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error("Save settings error:", err);

      setError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-settings">

        {/* =====================================================
            INTRO
        ===================================================== */}

        <section className="admin-settings-intro">
          <h2>Settings</h2>

          <p>
            Manage your account and notification preferences.
          </p>
        </section>


        {/* =====================================================
            SUCCESS / ERROR MESSAGE
        ===================================================== */}

        {message && (
          <div className="admin-settings-message success">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-settings-message error">
            {error}
          </div>
        )}


        {/* =====================================================
            ACCOUNT SETTINGS
        ===================================================== */}

        <section className="admin-settings-card">
          <h3>Account Settings</h3>

          {loading ? (
            <p className="admin-settings-loading">
              Loading account information...
            </p>
          ) : profile ? (
            <>
              <div className="admin-settings-row">
                <div>
                  <strong>Email Address</strong>

                  <p>{profile.email}</p>
                </div>
              </div>

              <div className="admin-settings-row">
                <div>
                  <strong>Role</strong>

                  <p>
                    {profile.role === "admin"
                      ? "Administrator"
                      : profile.role}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="admin-settings-loading">
              Account information unavailable.
            </p>
          )}
        </section>


        {/* =====================================================
            NOTIFICATION PREFERENCES
        ===================================================== */}

        <section className="admin-settings-card">
          <h3>Notification Preferences</h3>

          <div className="admin-settings-option">

            <div>
              <strong>Email Notifications</strong>

              <p>
                Receive important system notifications by email.
              </p>
            </div>

            <label className="admin-settings-switch">

              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) =>
                  setEmailNotifications(e.target.checked)
                }
              />

              <span></span>

            </label>

          </div>


          <div className="admin-settings-option">

            <div>
              <strong>Result Notifications</strong>

              <p>
                Receive notifications when examination results are updated.
              </p>
            </div>

            <label className="admin-settings-switch">

              <input
                type="checkbox"
                checked={resultNotifications}
                onChange={(e) =>
                  setResultNotifications(e.target.checked)
                }
              />

              <span></span>

            </label>

          </div>
        </section>


        {/* =====================================================
            SYSTEM INFORMATION
        ===================================================== */}

        <section className="admin-settings-card">
          <h3>System Information</h3>

          <div className="admin-settings-system-grid">

            <div>
              <span>Application</span>

              <strong>
                Exam Result Tracker
              </strong>
            </div>

            <div>
              <span>Version</span>

              <strong>
                1.0.0
              </strong>
            </div>

            <div>
              <span>Environment</span>

              <strong>
                Local Development
              </strong>
            </div>

          </div>
        </section>


        {/* =====================================================
            SAVE BUTTON
        ===================================================== */}

        <button
          type="button"
          className="admin-settings-save"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

      </div>
    </AdminLayout>
  );
}

export default AdminSettings;