import StudentLayout from "../layouts/StudentLayout";
import NotificationItem from "../components/NotificationItem";
import "./StudentNotifications.css";

function StudentNotifications() {
  const notifications = [
    {
      title: "New semester result published",
      message: "Your Semester 4 result is now available.",
      time: "2 hours ago",
    },
    {
      title: "Examination announcement",
      message: "The semester examination timetable has been released.",
      time: "Yesterday",
    },
    {
      title: "Profile information reminder",
      message: "Please make sure your student profile information is up to date.",
      time: "3 days ago",
    },
  ];

  return (
    <StudentLayout>
      <div className="student-notifications">

        <section className="notifications-intro">
          <h2>Notifications</h2>
          <p>
            Stay updated with important academic announcements.
          </p>
        </section>

        <section className="notifications-list">
          {notifications.map((notification, index) => (
            <NotificationItem
              key={index}
              title={notification.title}
              message={notification.message}
              time={notification.time}
            />
          ))}
        </section>

      </div>
    </StudentLayout>
  );
}

export default StudentNotifications;