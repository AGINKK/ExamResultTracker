import StudentLayout from "../layouts/StudentLayout";
import "./StudentSettings.css";

function StudentSettings() {
  return (
    <StudentLayout>
      <div className="student-settings">

        <section className="settings-intro">
          <h2>Settings</h2>
          <p>
            Manage your account preferences and notification settings.
          </p>
        </section>

        <section className="settings-card">
          <h3>Account Information</h3>

          <div className="settings-grid">
            <div className="settings-item">
              <span>Email</span>
              <strong>student@example.com</strong>
            </div>

            <div className="settings-item">
              <span>Phone</span>
              <strong>9876543210</strong>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <h3>Notification Preferences</h3>

          <div className="setting-option">
            <div>
              <strong>Academic Notifications</strong>
              <p>
                Receive important academic announcements.
              </p>
            </div>

            <input type="checkbox" defaultChecked />
          </div>

          <div className="setting-option">
            <div>
              <strong>Result Notifications</strong>
              <p>
                Receive notifications when new results are published.
              </p>
            </div>

            <input type="checkbox" defaultChecked />
          </div>
        </section>

      </div>
    </StudentLayout>
  );
}

export default StudentSettings;