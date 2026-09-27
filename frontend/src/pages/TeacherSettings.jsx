import { useState } from "react";
import TeacherLayout from "../layouts/TeacherLayout";
import "./TeacherSettings.css";

function TeacherSettings() {
  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [resultNotifications, setResultNotifications] =
    useState(true);

  const handleSaveSettings = () => {
    alert("Settings saved successfully.");
  };

  return (
    <TeacherLayout>
      <div className="teacher-settings">

        <section className="teacher-settings-intro">
          <h2>Settings</h2>
          <p>
            Manage your account and notification preferences.
          </p>
        </section>

        <section className="teacher-settings-card">
          <h3>Notification Settings</h3>

          <div className="teacher-setting-item">
            <div>
              <strong>Email Notifications</strong>
              <p>
                Receive important academic updates through email.
              </p>
            </div>

            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) =>
                setEmailNotifications(e.target.checked)
              }
            />
          </div>

          <div className="teacher-setting-item">
            <div>
              <strong>Result Notifications</strong>
              <p>
                Receive notifications related to result submission.
              </p>
            </div>

            <input
              type="checkbox"
              checked={resultNotifications}
              onChange={(e) =>
                setResultNotifications(e.target.checked)
              }
            />
          </div>
        </section>

        <section className="teacher-settings-card">
          <h3>Account Settings</h3>

          <div className="teacher-setting-info">
            <span>Account Role</span>
            <strong>Teacher</strong>
          </div>

          <div className="teacher-setting-info">
            <span>Account Status</span>
            <strong>Active</strong>
          </div>
        </section>

        <div className="teacher-settings-actions">
          <button
            type="button"
            onClick={handleSaveSettings}
          >
            Save Settings
          </button>
        </div>

      </div>
    </TeacherLayout>
  );
}

export default TeacherSettings;