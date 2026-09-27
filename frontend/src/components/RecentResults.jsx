function RecentResults() {
  const results = [
    {
      semester: "Semester 4",
      examination: "MCA",
      grade: "A",
      status: "Passed",
    },
    {
      semester: "Semester 3",
      examination: "MCA",
      grade: "A+",
      status: "Passed",
    },
    {
      semester: "Semester 2",
      examination: "MCA",
      grade: "B+",
      status: "Passed",
    },
  ];

  return (
    <section className="recent-results">
      <h2>Recent Results</h2>

      <div className="results-table-container">
        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>Examination</th>
              <th>Grade</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result.semester}</td>
                <td>{result.examination}</td>
                <td>{result.grade}</td>
                <td>{result.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentResults;