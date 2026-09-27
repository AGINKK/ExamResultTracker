import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { loginUser } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password || !role) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      if (!data.success) {
        setError(data.message || "Login failed.");
        return;
      }

      // Verify selected role matches the account role
      if (data.user.role !== role) {
        setError("Selected role does not match your account.");
        return;
      }

      // Store login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (data.user.role === "student") {
        navigate("/student/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="login-page">

        <div className="login-card">

          <div className="login-heading">
            <p>EXAM RESULT TRACKER</p>

            <h1>Welcome Back</h1>

            <span>
              Login to access your academic portal.
            </span>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="email">
                Email or User ID
              </label>

              <input
                type="text"
                id="email"
                placeholder="Enter your email or user ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">
                Login As
              </label>

              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="" disabled>
                  Select your role
                </option>

                <option value="admin">
                  Admin
                </option>

                <option value="teacher">
                  Teacher
                </option>

                <option value="student">
                  Student
                </option>
              </select>
            </div>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="login-footer">
            <Link to="/">
              ← Back to Home
            </Link>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Login;
