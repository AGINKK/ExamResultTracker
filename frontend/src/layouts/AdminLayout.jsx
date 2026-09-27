import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import "./DashboardLayout.css";

function AdminLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar role="Admin" />

      <div className="dashboard-main">
        <DashboardHeader role="Admin" />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;