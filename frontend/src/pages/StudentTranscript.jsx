import StudentLayout from "../layouts/StudentLayout";
import "./StudentTranscript.css";

function StudentTranscript() {
  const semesters = [
    {
      semester: "Semester 1",
      gpa: "8.20",
      status: "Passed",
    },
    {
      semester: "Semester 2",
      gpa: "8.50",
      status: "Passed",
    },
    {
      semester: "Semester 3",
      gpa: "8.70",
      status: "Passed",
    },
    {
      semester: "Semester 4",
      gpa: "8.90",
      status: "Passed",
    },
  ];

  return (
    <StudentLayout>
      <div className="student-transcript">

        <section className="transcript-intro">
          <h2>Academic Transcript</h2>
          <p>
            View your overall academic performance by semester.
          </p>
        </section>

        <section className="transcript-student-info">
          <h3>Student Information</h3>

          <div className="transcript-info-grid">
            <div>
              <span>Student Name</span>
              <strong>Student Name</strong>
            </div>

            <div>
              <span>Student ID</span>
              <strong>STU001</strong>
            </div>

            <div>
              <span>Program</span>
              <strong>MCA</strong>
            </div>

            <div>
              <span>Department</span>
              <strong>Computer Applications</strong>
            </div>
          </div>
        </section>

        <section className="transcript-table-section">
          <h3>Semester Performance</h3>

          <div className="transcript-table-container">
            <table>
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>GPA</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {semesters.map((semester, index) => (
                  <tr key={index}>
                    <td>{semester.semester}</td>
                    <td>{semester.gpa}</td>
                    <td>{semester.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="transcript-summary">
          <h3>Overall Academic Summary</h3>

          <div className="overall-cgpa">
            <span>Overall CGPA</span>
            <strong>8.58</strong>
          </div>
        </section>

      </div>
    </StudentLayout>
  );
}

export default StudentTranscript;