import StudentLayout from "../layouts/StudentLayout";
import StatCard from "../components/StatCard";
import RecentResults from "../components/RecentResults";
import QuickAction from "../components/QuickAction";
import "./StudentDashboard.css";

function StudentDashboard() {
  return (
    <StudentLayout>
      <div className="student-dashboard">

        <section className="student-welcome">
          <h2>Welcome back, Student</h2>
          <p>
            Here is an overview of your academic performance.
          </p>
        </section>

        <section className="student-stats">
          <StatCard
            title="Results"
            value="5"
            description="Published results"
          />

          <StatCard
            title="Semesters"
            value="4"
            description="Completed semesters"
          />

          <StatCard
            title="Subjects"
            value="6"
            description="Current subjects"
          />
        </section>

        <RecentResults />

        <section className="student-quick-actions">
          <h2>Quick Actions</h2>

          <div className="quick-actions-grid">
            <QuickAction
              title="View Results"
              description="View your complete academic results."
              to="/student/results"
            />

            <QuickAction
              title="View Transcript"
              description="View your academic transcript."
              to="/student/transcript"
            />

            <QuickAction
              title="My Profile"
              description="View and manage your profile."
              to="/student/profile"
            />
          </div>
        </section>

      </div>
    </StudentLayout>
  );
}

export default StudentDashboard;