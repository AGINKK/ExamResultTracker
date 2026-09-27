import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import "./Home.css";

function Home() {
  return (
    <MainLayout>
      <div className="home-page">

        {/* Hero Section */}
        <section className="home-hero">

          <div className="home-hero-content">
            <p className="home-label">
              CAMPUS & EDUCATION
            </p>

            <h1>
              Exam Result
              <span> Tracker</span>
            </h1>

            <p className="home-description">
              A centralized academic platform for managing
              students, teachers, examinations, attendance,
              and academic results efficiently.
            </p>

            <div className="home-actions">
              <Link
                to="/login"
                className="home-primary-button"
              >
                Login to Portal
              </Link>

              <a
                href="#features"
                className="home-secondary-button"
              >
                Explore Features
              </a>
            </div>
          </div>

          <div className="home-overview-card">

            <div className="home-card-heading">
              <div>
                <p>Academic Portal</p>
                <h3>Result Management</h3>
              </div>

              <span>Active</span>
            </div>

            <div className="home-card-line"></div>

            <div className="home-overview-item">
              <div>
                <strong>Students</strong>
                <small>Academic records</small>
              </div>

              <b>250+</b>
            </div>

            <div className="home-overview-item">
              <div>
                <strong>Teachers</strong>
                <small>Teaching staff</small>
              </div>

              <b>15+</b>
            </div>

            <div className="home-overview-item">
              <div>
                <strong>Examinations</strong>
                <small>Academic assessments</small>
              </div>

              <b>6+</b>
            </div>

          </div>

        </section>

        {/* Features */}
        <section
          id="features"
          className="home-features"
        >

          <div className="home-section-heading">
            <p>CORE FEATURES</p>

            <h2>
              Everything needed for academic management
            </h2>

            <span>
              A simple and organized platform for managing
              academic activities.
            </span>
          </div>

          <div className="home-feature-grid">

            <div className="home-feature-card">
              <span>01</span>
              <h3>Student Management</h3>
              <p>
                Manage student information and academic
                records in one place.
              </p>
            </div>

            <div className="home-feature-card">
              <span>02</span>
              <h3>Teacher Management</h3>
              <p>
                Manage teacher accounts, assignments,
                and academic responsibilities.
              </p>
            </div>

            <div className="home-feature-card">
              <span>03</span>
              <h3>Examination Management</h3>
              <p>
                Organize subjects, examinations, and
                examination schedules.
              </p>
            </div>

            <div className="home-feature-card">
              <span>04</span>
              <h3>Result Management</h3>
              <p>
                Enter, manage, publish, and view
                examination results.
              </p>
            </div>

            <div className="home-feature-card">
              <span>05</span>
              <h3>Attendance</h3>
              <p>
                Maintain and manage student attendance
                records efficiently.
              </p>
            </div>

            <div className="home-feature-card">
              <span>06</span>
              <h3>Announcements</h3>
              <p>
                Share important academic information
                with students and teachers.
              </p>
            </div>

          </div>

        </section>

        {/* User Roles */}
        <section className="home-roles">

          <div className="home-section-heading">
            <p>ROLE-BASED ACCESS</p>

            <h2>
              Designed for every academic role
            </h2>
          </div>

          <div className="home-role-grid">

            <div className="home-role-card">
              <span>ADMIN</span>

              <h3>Administrator</h3>

              <p>
                Manage students, teachers, courses,
                subjects, examinations, results,
                and announcements.
              </p>
            </div>

            <div className="home-role-card">
              <span>TEACHER</span>

              <h3>Teacher</h3>

              <p>
                Manage assigned students, attendance,
                examinations, and student results.
              </p>
            </div>

            <div className="home-role-card">
              <span>STUDENT</span>

              <h3>Student</h3>

              <p>
                Access personal information, academic
                results, notifications, and records.
              </p>
            </div>

          </div>

        </section>

        {/* Login CTA */}
        <section className="home-cta">

          <h2>
            Access your academic dashboard
          </h2>

          <p>
            Login to continue to your personalized portal.
          </p>

          <Link
            to="/login"
            className="home-primary-button"
          >
            Login to Portal
          </Link>

        </section>

      </div>
    </MainLayout>
  );
}

export default Home;