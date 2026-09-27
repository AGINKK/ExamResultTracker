import { Link } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="admin-dashboard">

        <section className="admin-welcome">
          <h2>Welcome back, Admin</h2>
          <p>
            Manage students, teachers, examinations, subjects, and
            academic results from here.
          </p>
        </section>

        <section className="admin-stats">

          <div className="admin-stat-card">
            <h3>Students</h3>
            <p className="admin-stat-value">250</p>
            <p className="admin-stat-description">
              Registered students
            </p>
          </div>

          <div className="admin-stat-card">
            <h3>Teachers</h3>
            <p className="admin-stat-value">18</p>
            <p className="admin-stat-description">
              Active teachers
            </p>
          </div>

          <div className="admin-stat-card">
            <h3>Subjects</h3>
            <p className="admin-stat-value">24</p>
            <p className="admin-stat-description">
              Available subjects
            </p>
          </div>

          <div className="admin-stat-card">
            <h3>Exams</h3>
            <p className="admin-stat-value">6</p>
            <p className="admin-stat-description">
              Scheduled examinations
            </p>
          </div>

        </section>

        <section className="admin-quick-actions">
          <h2>Quick Actions</h2>

          <div className="admin-actions-grid">

            <Link
              to="/admin/students"
              className="admin-action-card"
            >
              <h3>Manage Students</h3>
              <p>
                Add, view, and manage student records.
              </p>
            </Link>

            <Link
              to="/admin/teachers"
              className="admin-action-card"
            >
              <h3>Manage Teachers</h3>
              <p>
                Manage teacher accounts and assignments.
              </p>
            </Link>

            <Link
              to="/admin/subjects"
              className="admin-action-card"
            >
              <h3>Manage Subjects</h3>
              <p>
                Create and manage academic subjects.
              </p>
            </Link>

            <Link
              to="/admin/exams"
              className="admin-action-card"
            >
              <h3>Manage Exams</h3>
              <p>
                Create and manage examination schedules.
              </p>
            </Link>

          </div>
        </section>

      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;