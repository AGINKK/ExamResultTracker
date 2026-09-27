import Navbar from "../components/Navbar";
import "./MainLayout.css";

function MainLayout({ children }) {
  return (
    <div>
      <Navbar />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;