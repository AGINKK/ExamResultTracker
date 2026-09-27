import { useEffect, useMemo, useState } from "react";
import TeacherLayout from "../layouts/TeacherLayout";
import { apiGet, apiPut } from "../services/api";
import "./TeacherResults.css";

function TeacherResults() {
  const [results, setResults] = useState([]);

  const [exam, setExam] = useState("");
  const [subject, setSubject] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD TEACHER RESULTS
  // =====================================================

  const loadResults = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiGet(
        "/api/results/teacher/my-results"
      );

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      setResults(data);

      // -------------------------------------------------
      // Keep current selection if it still exists
      // -------------------------------------------------

      if (data.length === 0) {
        setExam("");
        setSubject("");
        return;
      }

      const availableExams = [
        ...new Set(
          data
            .map((item) => item.exam_name)
            .filter(Boolean)
        )
      ];

      const selectedExam =
        availableExams.includes(exam)
          ? exam
          : availableExams[0];

      setExam(selectedExam);

      const availableSubjects = [
        ...new Set(
          data
            .filter(
              (item) =>
                item.exam_name === selectedExam
            )
            .map((item) => item.subject_name)
            .filter(Boolean)
        )
      ];

      const selectedSubject =
        availableSubjects.includes(subject)
          ? subject
          : availableSubjects[0] || "";

      setSubject(selectedSubject);

    } catch (error) {
      console.error(
        "Teacher results error:",
        error
      );

      setError(
        error.message ||
          "Failed to load teacher results."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadResults();
  }, []);

  // =====================================================
  // EXAMINATIONS
  // =====================================================

  const exams = useMemo(() => {
    return [
      ...new Set(
        results
          .map((result) => result.exam_name)
          .filter(Boolean)
      )
    ];
  }, [results]);

  // =====================================================
  // SUBJECTS
  // =====================================================

  const subjects = useMemo(() => {
    return [
      ...new Set(
        results
          .filter(
            (result) =>
              result.exam_name === exam
          )
          .map(
            (result) =>
              result.subject_name
          )
          .filter(Boolean)
      )
    ];
  }, [results, exam]);

  // =====================================================
  // EXAM CHANGE
  // =====================================================

  const handleExamChange = (value) => {
    setExam(value);
    setSuccess("");
    setError("");

    const firstSubject =
      results.find(
        (result) =>
          result.exam_name === value
      )?.subject_name || "";

    setSubject(firstSubject);
  };

  // =====================================================
  // SUBJECT CHANGE
  // =====================================================

  const handleSubjectChange = (value) => {
    setSubject(value);
    setSuccess("");
    setError("");
  };

  // =====================================================
  // FILTER RESULTS
  // =====================================================

  const filteredResults = useMemo(() => {
    return results.filter(
      (result) =>
        result.exam_name === exam &&
        result.subject_name === subject
    );
  }, [results, exam, subject]);

  // =====================================================
  // MARK CHANGE
  // =====================================================

  const handleMarksChange = (
    resultId,
    value
  ) => {
    setSuccess("");
    setError("");

    setResults((currentResults) =>
      currentResults.map((result) =>
        result.result_id === resultId
          ? {
              ...result,
              marks_obtained: value
            }
          : result
      )
    );
  };

  // =====================================================
  // CALCULATE GRADE
  // =====================================================

  const getGrade = (
    marks,
    maxMarks
  ) => {
    const obtained = Number(marks);
    const maximum = Number(maxMarks);

    if (
      Number.isNaN(obtained) ||
      Number.isNaN(maximum) ||
      maximum <= 0
    ) {
      return "-";
    }

    const percentage =
      (obtained / maximum) * 100;

    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";

    return "F";
  };

  // =====================================================
  // CALCULATE STATUS
  // =====================================================

  const getStatus = (
    marks,
    maxMarks
  ) => {
    const obtained = Number(marks);
    const maximum = Number(maxMarks);

    if (
      Number.isNaN(obtained) ||
      Number.isNaN(maximum) ||
      maximum <= 0
    ) {
      return "-";
    }

    const percentage =
      (obtained / maximum) * 100;

    return percentage >= 40
      ? "Pass"
      : "Fail";
  };

  // =====================================================
  // SAVE RESULTS
  // =====================================================

  const handleSaveResults = async () => {
    if (filteredResults.length === 0) {
      setError(
        "No results available for the selected examination and subject."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // -------------------------------------------------
      // VALIDATE ALL MARKS
      // -------------------------------------------------

      for (const result of filteredResults) {
        const marks = Number(
          result.marks_obtained
        );

        const maxMarks = Number(
          result.max_marks
        );

        if (
          result.marks_obtained === "" ||
          result.marks_obtained === null ||
          result.marks_obtained === undefined
        ) {
          throw new Error(
            `Please enter marks for ${result.student_name}.`
          );
        }

        if (
          Number.isNaN(marks) ||
          marks < 0 ||
          marks > maxMarks
        ) {
          throw new Error(
            `Invalid marks for ${result.student_name}. Marks must be between 0 and ${maxMarks}.`
          );
        }
      }

      // -------------------------------------------------
      // SAVE EACH RESULT
      // -------------------------------------------------

      for (const result of filteredResults) {
        await apiPut(
          `/api/results/teacher/${result.result_id}`,
          {
            marks_obtained:
              Number(result.marks_obtained)
          }
        );
      }

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      setSuccess(
        "Results saved successfully."
      );

      // -------------------------------------------------
      // RELOAD DATABASE DATA
      // -------------------------------------------------

      await loadResults();

    } catch (error) {
      console.error(
        "Save teacher results error:",
        error
      );

      setError(
        error.message ||
          "Failed to save results."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <TeacherLayout>

      <div className="teacher-results">

        {/* =========================================
            HEADER
        ========================================= */}

        <section className="teacher-page-header">

          <h2>
            Results & Marks
          </h2>

          <p>
            Enter and manage student
            examination results.
          </p>

        </section>


        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <div className="teacher-dashboard-error">
            {error}
          </div>
        )}


        {/* =========================================
            SUCCESS
        ========================================= */}

        {success && (
          <div className="teacher-result-success">
            {success}
          </div>
        )}


        {/* =========================================
            FILTERS
        ========================================= */}

        <section className="teacher-results-filters">

          {/* EXAMINATION */}

          <div className="teacher-result-field">

            <label htmlFor="teacher-exam">
              Examination
            </label>

            <select
              id="teacher-exam"
              value={exam}
              onChange={(e) =>
                handleExamChange(
                  e.target.value
                )
              }
              disabled={
                loading ||
                exams.length === 0
              }
            >

              {exams.length === 0 ? (

                <option value="">
                  No examinations available
                </option>

              ) : (

                exams.map(
                  (examName) => (
                    <option
                      key={examName}
                      value={examName}
                    >
                      {examName}
                    </option>
                  )
                )

              )}

            </select>

          </div>


          {/* SUBJECT */}

          <div className="teacher-result-field">

            <label htmlFor="teacher-subject">
              Subject
            </label>

            <select
              id="teacher-subject"
              value={subject}
              onChange={(e) =>
                handleSubjectChange(
                  e.target.value
                )
              }
              disabled={
                loading ||
                subjects.length === 0
              }
            >

              {subjects.length === 0 ? (

                <option value="">
                  No subjects available
                </option>

              ) : (

                subjects.map(
                  (subjectName) => (
                    <option
                      key={subjectName}
                      value={subjectName}
                    >
                      {subjectName}
                    </option>
                  )
                )

              )}

            </select>

          </div>

        </section>


        {/* =========================================
            RESULTS CONTENT
        ========================================= */}

        <section className="teacher-results-content">

          {loading ? (

            <div className="teacher-loading">
              Loading results...
            </div>

          ) : (

            <>
              <div className="teacher-results-summary">

                <div>
                  <strong>
                    Examination:
                  </strong>{" "}
                  {exam || "-"}
                </div>

                <div>
                  <strong>
                    Subject:
                  </strong>{" "}
                  {subject || "-"}
                </div>

                <div>
                  <strong>
                    Students:
                  </strong>{" "}
                  {filteredResults.length}
                </div>

              </div>


              <div className="teacher-results-table-container">

                <table>

                  <thead>

                    <tr>

                      <th>
                        Student ID
                      </th>

                      <th>
                        Student Name
                      </th>

                      <th>
                        Maximum Marks
                      </th>

                      <th>
                        Marks Obtained
                      </th>

                      <th>
                        Grade
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredResults.length > 0 ? (

                      filteredResults.map(
                        (result) => {

                          const grade =
                            getGrade(
                              result.marks_obtained,
                              result.max_marks
                            );

                          const status =
                            getStatus(
                              result.marks_obtained,
                              result.max_marks
                            );

                          return (
                            <tr
                              key={
                                result.result_id
                              }
                            >

                              <td>
                                {
                                  result.student_code
                                }
                              </td>

                              <td>
                                {
                                  result.student_name
                                }
                              </td>

                              <td>
                                {
                                  result.max_marks
                                }
                              </td>

                              <td>

                                <input
                                  type="number"
                                  min="0"
                                  max={
                                    result.max_marks
                                  }
                                  step="0.01"
                                  value={
                                    result.marks_obtained ??
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleMarksChange(
                                      result.result_id,
                                      e.target.value
                                    )
                                  }
                                  disabled={saving}
                                />

                              </td>

                              <td>

                                <span className="result-grade">
                                  {grade}
                                </span>

                              </td>

                              <td>

                                <span
                                  className={
                                    status === "Pass"
                                      ? "result-status passed"
                                      : status === "Fail"
                                      ? "result-status failed"
                                      : "result-status"
                                  }
                                >
                                  {status}
                                </span>

                              </td>

                            </tr>
                          );
                        }
                      )

                    ) : (

                      <tr>

                        <td
                          colSpan="6"
                          className="teacher-no-results"
                        >
                          No results found for
                          the selected examination
                          and subject.
                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>


              {/* =====================================
                  SAVE BUTTON
              ===================================== */}

              <div className="teacher-results-actions">

                <button
                  type="button"
                  onClick={
                    handleSaveResults
                  }
                  disabled={
                    loading ||
                    saving ||
                    filteredResults.length === 0
                  }
                >

                  {saving
                    ? "Saving..."
                    : "Save Results"}

                </button>

              </div>

            </>

          )}

        </section>

      </div>

    </TeacherLayout>
  );
}

export default TeacherResults;