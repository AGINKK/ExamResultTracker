import { Link, useNavigate } from "react-router-dom";
import "./DashboardSidebar.css";

function DashboardSidebar({ role }) {
  const rolePath = role.toLowerCase();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="dashboard-sidebar">
      <h2 className="dashboard-sidebar-title">
        {role} Panel
      </h2>

      <nav>
        <ul>
          {/* Dashboard */}
          <li>
            <Link to={`/${rolePath}/dashboard`}>
              Dashboard
            </Link>
          </li>

          {/* Admin Navigation */}
          {role === "Admin" && (
            <>
              <li>
                <Link to="/admin/students">
                  Students
                </Link>
              </li>

              <li>
                <Link to="/admin/teachers">
                  Teachers
                </Link>
              </li>

              <li>
                <Link to="/admin/courses">
                  Courses
                </Link>
              </li>

              <li>
                <Link to="/admin/subjects">
                  Subjects
                </Link>
              </li>

              <li>
                <Link to="/admin/exams">
                  Exams
                </Link>
              </li>

              <li>
                <Link to="/admin/results">
                  Results
                </Link>
              </li>

              <li>
                <Link to="/admin/announcements">
                  Announcements
                </Link>
              </li>
            </>
          )}

          {/* Teacher Navigation */}
          {role === "Teacher" && (
            <>
              <li>
                <Link to="/teacher/students">
                  Students
                </Link>
              </li>

              <li>
                <Link to="/teacher/results">
                  Results
                </Link>
              </li>

              <li>
                <Link to="/teacher/attendance">
                  Attendance
                </Link>
              </li>

              <li>
                <Link to="/teacher/announcements">
                  Announcements
                </Link>
              </li>
            </>
          )}

          {/* Profile */}
          <li>
            <Link to={`/${rolePath}/profile`}>
              Profile
            </Link>
          </li>

          {/* Student Navigation */}
          {role === "Student" && (
            <>
              <li>
                <Link to="/student/notifications">
                  Notifications
                </Link>
              </li>

              <li>
                <Link to="/student/settings">
                  Settings
                </Link>
              </li>
            </>
          )}

          {/* Teacher Settings */}
          {role === "Teacher" && (
            <li>
              <Link to="/teacher/settings">
                Settings
              </Link>
            </li>
          )}

          {/* Admin Settings */}
          {role === "Admin" && (
            <li>
              <Link to="/admin/settings">
                Settings
              </Link>
            </li>
          )}

          {/* Home */}
          <li>
            <Link to="/">
              Home
            </Link>
          </li>

          {/* Logout */}
          <li>
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default DashboardSidebar;