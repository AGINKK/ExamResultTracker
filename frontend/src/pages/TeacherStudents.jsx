import { useEffect, useState } from "react";
import TeacherLayout from "../layouts/TeacherLayout";
import { apiGet } from "../services/api";
import "./TeacherStudents.css";

function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiGet("/api/students");

        setStudents(response.data || []);
      } catch (error) {
        console.error(
          "Teacher students error:",
          error
        );

        setError(
          error.message ||
            "Failed to load students."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();

    return (
      String(student.student_id || "")
        .toLowerCase()
        .includes(search) ||
      String(student.name || "")
        .toLowerCase()
        .includes(search) ||
      String(student.course_name || "")
        .toLowerCase()
        .includes(search) ||
      String(student.email || "")
        .toLowerCase()
        .includes(search)
    );
  });

  return (
    <TeacherLayout>
      <div className="teacher-students">

        {/* PAGE HEADER */}

        <section className="teacher-page-header">
          <h2>Students</h2>

          <p>
            View and manage students assigned to you.
          </p>
        </section>


        {/* ERROR */}

        {error && (
          <div className="teacher-dashboard-error">
            {error}
          </div>
        )}


        {/* CONTENT */}

        <section className="teacher-students-content">

          {/* SEARCH */}

          <div className="teacher-search-box">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>


          {/* LOADING */}

          {loading ? (
            <div className="teacher-loading">
              Loading students...
            </div>
          ) : (

            <div className="teacher-students-table-container">

              <table>

                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Semester</th>
                    <th>Email</th>
                  </tr>
                </thead>


                <tbody>

                  {filteredStudents.length > 0 ? (

                    filteredStudents.map((student) => (

                      <tr key={student.student_id}>

                        <td>
                          {student.student_id}
                        </td>

                        <td>
                          {student.name}
                        </td>

                        <td>
                          {student.course_name}
                        </td>

                        <td>
                          Semester {student.semester}
                        </td>

                        <td>
                          {student.email}
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="5"
                        className="teacher-no-students"
                      >
                        {searchTerm
                          ? "No students found."
                          : "No students available."}
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>
    </TeacherLayout>
  );
}

export default TeacherStudents;