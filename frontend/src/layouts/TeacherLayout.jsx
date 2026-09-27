import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import "./DashboardLayout.css";

function TeacherLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar role="Teacher" />

      <div className="dashboard-main">
        <DashboardHeader role="Teacher" />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;