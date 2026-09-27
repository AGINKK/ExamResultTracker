import { useEffect, useState } from "react";
import TeacherLayout from "../layouts/TeacherLayout";
import { getTeacherAnnouncements } from "../services/api";
import "./TeacherAnnouncements.css";

function TeacherAnnouncements() {

  const [announcements, setAnnouncements] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // LOAD ANNOUNCEMENTS
  // =====================================================

  useEffect(() => {
    fetchAnnouncements();
  }, []);


  const fetchAnnouncements = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
  await getTeacherAnnouncements();


      if (
        response.data &&
        response.data.success
      ) {

        setAnnouncements(
          response.data.data || []
        );

      } else {

        setAnnouncements([]);

        setError(
          response.data?.message ||
          "Failed to load announcements."
        );
      }

    } catch (error) {

      console.error(
        "Teacher announcements error:",
        error
      );

      setAnnouncements([]);

      setError(
        error.response?.data?.message ||
        "Failed to fetch announcements."
      );

    } finally {

      setLoading(false);
    }
  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateValue) => {

    if (!dateValue) {
      return "Date not available";
    }

    const date =
      new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };


  return (
    <TeacherLayout>

      <div className="teacher-announcements">

        {/* PAGE HEADER */}

        <section className="teacher-page-header">

          <h2>
            Announcements
          </h2>

          <p>
            View important academic announcements
            and notices.
          </p>

        </section>


        {/* LOADING */}

        {loading && (

          <section className="teacher-announcements-list">

            <article className="teacher-announcement-card">

              <p className="teacher-announcement-description">
                Loading announcements...
              </p>

            </article>

          </section>

        )}


        {/* ERROR */}

        {!loading && error && (

          <section className="teacher-announcements-list">

            <article className="teacher-announcement-card">

              <h3>
                Unable to load announcements
              </h3>

              <p className="teacher-announcement-description">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchAnnouncements}
                style={{
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Try Again
              </button>

            </article>

          </section>

        )}


        {/* NO ANNOUNCEMENTS */}

        {!loading &&
          !error &&
          announcements.length === 0 && (

            <section className="teacher-announcements-list">

              <article className="teacher-announcement-card">

                <h3>
                  No announcements available
                </h3>

                <p className="teacher-announcement-description">
                  There are currently no published
                  announcements for teachers.
                </p>

              </article>

            </section>

          )}


        {/* ANNOUNCEMENTS */}

        {!loading &&
          !error &&
          announcements.length > 0 && (

            <section className="teacher-announcements-list">

              {announcements.map(
                (announcement) => (

                  <article
                    className="teacher-announcement-card"
                    key={
                      announcement.announcement_id
                    }
                  >

                    <div className="teacher-announcement-top">

                      <h3>
                        {announcement.title}
                      </h3>

                      <span className="teacher-announcement-type">
                        {announcement.category}
                      </span>

                    </div>


                    <p className="teacher-announcement-description">
                      {announcement.message}
                    </p>


                    <p className="teacher-announcement-date">
                      Published:{" "}
                      {formatDate(
                        announcement.published_date
                      )}
                    </p>

                  </article>

                )
              )}

            </section>

          )}

      </div>

    </TeacherLayout>
  );
}

export default TeacherAnnouncements;