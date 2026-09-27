import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TeacherLayout from "../layouts/TeacherLayout";
import { apiGet } from "../services/api";
import "./TeacherDashboard.css";

function TeacherDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeacherDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiGet(
        "/api/teachers/me/dashboard"
      );

      console.log(
        "Teacher dashboard response:",
        response
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to load teacher dashboard."
        );
      }

      setDashboard(response.data);

    } catch (error) {
      console.error(
        "Teacher dashboard error:",
        error
      );

      setError(
        error.message ||
          "Failed to load teacher dashboard."
      );

      setDashboard(null);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherDashboard();
  }, []);

  const teacherName =
    dashboard?.teacher?.name || "Teacher";

  const studentCount =
    dashboard?.statistics?.students ?? 0;

  const subjectCount =
    dashboard?.statistics?.subjects ?? 0;

  const resultCount =
    dashboard?.statistics?.results ?? 0;

  return (
    <TeacherLayout>

      <div className="teacher-dashboard">

        {/* =========================================
            WELCOME SECTION
        ========================================= */}

        <section className="teacher-welcome">

          <h2>
            Welcome back,{" "}
            {loading ? "Teacher" : teacherName}
          </h2>

          <p>
            Manage your academic activities and
            student results from here.
          </p>

          {dashboard?.teacher?.designation && (
            <p className="teacher-welcome-role">
              {dashboard.teacher.designation}
              {dashboard.teacher.department
                ? ` • ${dashboard.teacher.department}`
                : ""}
            </p>
          )}

        </section>


        {/* =========================================
            ERROR MESSAGE
        ========================================= */}

        {error && (
          <div className="teacher-dashboard-error">

            <div>
              <strong>
                Unable to load dashboard
              </strong>

              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={loadTeacherDashboard}
              className="teacher-retry-button"
            >
              Try Again
            </button>

          </div>
        )}


        {/* =========================================
            STATISTICS
        ========================================= */}

        <section className="teacher-stats">

          {/* STUDENTS */}

          <div className="teacher-stat-card">

            <h3>Students</h3>

            <p className="teacher-stat-value">
              {loading ? "..." : studentCount}
            </p>

            <p className="teacher-stat-description">
              Active students
            </p>

          </div>


          {/* SUBJECTS */}

          <div className="teacher-stat-card">

            <h3>Subjects</h3>

            <p className="teacher-stat-value">
              {loading ? "..." : subjectCount}
            </p>

            <p className="teacher-stat-description">
              Active subjects
            </p>

          </div>


          {/* RESULTS */}

          <div className="teacher-stat-card">

            <h3>Results</h3>

            <p className="teacher-stat-value">
              {loading ? "..." : resultCount}
            </p>

            <p className="teacher-stat-description">
              Published passing results
            </p>

          </div>

        </section>


        {/* =========================================
            QUICK ACTIONS
        ========================================= */}

        <section className="teacher-quick-actions">

          <h2>Quick Actions</h2>

          <div className="teacher-actions-grid">

            {/* STUDENTS */}

            <Link
              to="/teacher/students"
              className="teacher-action-card"
            >
              <h3>
                Manage Students
              </h3>

              <p>
                View student records and
                academic information.
              </p>
            </Link>


            {/* RESULTS */}

            <Link
              to="/teacher/results"
              className="teacher-action-card"
            >
              <h3>
                Manage Results
              </h3>

              <p>
                View and manage student
                examination results.
              </p>
            </Link>


            {/* PROFILE */}

            <Link
              to="/teacher/profile"
              className="teacher-action-card"
            >
              <h3>
                My Profile
              </h3>

              <p>
                View and manage your
                teacher profile.
              </p>
            </Link>

          </div>

        </section>

      </div>

    </TeacherLayout>
  );
}

export default TeacherDashboard;