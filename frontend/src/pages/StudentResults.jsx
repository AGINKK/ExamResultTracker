import StudentLayout from "../layouts/StudentLayout";
import "./StudentResults.css";

function StudentResults() {
  const results = [
    {
      semester: "Semester 4",
      subjects: [
        {
          name: "Web Technology",
          marks: 85,
          grade: "A",
          status: "Passed",
        },
        {
          name: "Database Management",
          marks: 78,
          grade: "B+",
          status: "Passed",
        },
        {
          name: "Java Programming",
          marks: 82,
          grade: "A",
          status: "Passed",
        },
        {
          name: "Software Engineering",
          marks: 88,
          grade: "A+",
          status: "Passed",
        },
      ],
    },
    {
      semester: "Semester 3",
      subjects: [
        {
          name: "Data Structures",
          marks: 80,
          grade: "A",
          status: "Passed",
        },
        {
          name: "Operating Systems",
          marks: 76,
          grade: "B+",
          status: "Passed",
        },
        {
          name: "Computer Networks",
          marks: 84,
          grade: "A",
          status: "Passed",
        },
      ],
    },
  ];

  return (
    <StudentLayout>
      <div className="student-results">

        <section className="results-intro">
          <h2>Student Results</h2>
          <p>
            View your complete academic examination results.
          </p>
        </section>

        {results.map((result, index) => (
          <section className="semester-results" key={index}>
            <h3>{result.semester}</h3>

            <div className="results-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {result.subjects.map((subject, subjectIndex) => (
                    <tr key={subjectIndex}>
                      <td>{subject.name}</td>
                      <td>{subject.marks}</td>
                      <td>{subject.grade}</td>
                      <td>{subject.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

      </div>
    </StudentLayout>
  );
}

export default StudentResults;