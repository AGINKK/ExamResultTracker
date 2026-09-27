import "./DashboardHeader.css";

function DashboardHeader({ role }) {
  return (
    <header className="dashboard-header">
      <h1 className="dashboard-header-title">
        {role} Dashboard
      </h1>

      <span className="dashboard-header-user">
        Welcome, {role}
      </span>
    </header>
  );
}

export default DashboardHeader;