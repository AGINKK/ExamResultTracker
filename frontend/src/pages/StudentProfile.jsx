import StudentLayout from "../layouts/StudentLayout";
import "./StudentProfile.css";

function StudentProfile() {
  return (
    <StudentLayout>
      <div className="student-profile">

        <section className="profile-intro">
          <h2>Student Profile</h2>
          <p>
            View your personal and academic information.
          </p>
        </section>

        <section className="profile-card">
          <h3>Personal Information</h3>

          <div className="profile-grid">
            <div className="profile-item">
              <span>Name</span>
              <strong>Student Name</strong>
            </div>

            <div className="profile-item">
              <span>Email</span>
              <strong>student@example.com</strong>
            </div>

            <div className="profile-item">
              <span>Phone</span>
              <strong>9876543210</strong>
            </div>

            <div className="profile-item">
              <span>Date of Birth</span>
              <strong>01 January 2000</strong>
            </div>
          </div>
        </section>

        <section className="profile-card">
          <h3>Academic Information</h3>

          <div className="profile-grid">
            <div className="profile-item">
              <span>Student ID</span>
              <strong>STU001</strong>
            </div>

            <div className="profile-item">
              <span>Program</span>
              <strong>MCA</strong>
            </div>

            <div className="profile-item">
              <span>Department</span>
              <strong>Computer Applications</strong>
            </div>

            <div className="profile-item">
              <span>Current Semester</span>
              <strong>Semester 4</strong>
            </div>

            <div className="profile-item">
              <span>Admission Year</span>
              <strong>2024</strong>
            </div>
          </div>
        </section>

      </div>
    </StudentLayout>
  );
}

export default StudentProfile;