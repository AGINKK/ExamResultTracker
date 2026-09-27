import { useState } from "react";
import TeacherLayout from "../layouts/TeacherLayout";
import "./TeacherAttendance.css";

function TeacherAttendance() {
  const [date, setDate] = useState("2026-08-26");

  const [students, setStudents] = useState([
    {
      id: "STU001",
      name: "Aarav Sharma",
      status: "Present",
    },
    {
      id: "STU002",
      name: "Priya Nair",
      status: "Present",
    },
    {
      id: "STU003",
      name: "Rahul Kumar",
      status: "Absent",
    },
    {
      id: "STU004",
      name: "Ananya Das",
      status: "Present",
    },
    {
      id: "STU005",
      name: "Vivek Singh",
      status: "Absent",
    },
  ]);

  const handleStatusChange = (id, status) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === id
          ? {
              ...student,
              status,
            }
          : student
      )
    );
  };

  const handleSaveAttendance = () => {
    alert("Attendance saved successfully.");
  };

  return (
    <TeacherLayout>
      <div className="teacher-attendance">

        <section className="teacher-page-header">
          <h2>Attendance</h2>
          <p>
            Mark and manage student attendance.
          </p>
        </section>

        <section className="teacher-attendance-filters">
          <div className="teacher-attendance-field">
            <label htmlFor="attendance-date">
              Attendance Date
            </label>

            <input
              id="attendance-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </section>

        <section className="teacher-attendance-content">

          <div className="teacher-attendance-table-container">
            <table>

              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Attendance Status</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>

                    <td>{student.id}</td>

                    <td>{student.name}</td>

                    <td>
                      <select
                        value={student.status}
                        onChange={(e) =>
                          handleStatusChange(
                            student.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Present">
                          Present
                        </option>

                        <option value="Absent">
                          Absent
                        </option>
                      </select>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          <div className="teacher-attendance-actions">
            <button
              type="button"
              onClick={handleSaveAttendance}
            >
              Save Attendance
            </button>
          </div>

        </section>

      </div>
    </TeacherLayout>
  );
}

export default TeacherAttendance;