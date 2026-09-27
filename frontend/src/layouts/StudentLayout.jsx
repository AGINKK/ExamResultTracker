import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import "./DashboardLayout.css";

function StudentLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar role="Student" />

      <div className="dashboard-main">
        <DashboardHeader role="Student" />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;