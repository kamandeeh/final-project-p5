import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useUser } from "../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const GITHUB_CLIENT_ID = "Ov23lirLMXX8vKuDbf56";
const GOOGLE_CLIENT_ID = "787148443112-9520vrv4jpljuuhtg0et7r2bp7emln30.apps.googleusercontent.com";

const Login = () => {
  const { login } = useUser(); // Use global authentication state
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate("/profile");
    } else {
      setError(result.error);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        navigate("/");
      } else {
        setError("Google authentication failed.");
      }
    } catch (err) {
      console.error("Google auth error:", err);
      setError("Google authentication failed.");
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = `http://127.0.0.1:5000/auth/github`;
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          background: "linear-gradient(to right, #4682B4, #5A9BD5)",
        }}
      >
        <div
          className="card shadow p-4 bg-white"
          style={{
            width: "22rem",
            borderRadius: "10px",
            background: "linear-gradient(to right, #2FC, #e1EC)",
          }}
        >
          <h2 className="text-center mb-3">Login</h2>
          {error && <p className="text-danger text-center">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-warning w-100">
              Login
            </button>
          </form>

          <div className="mt-3 text-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Login Failed")} />
            <button onClick={handleGitHubLogin} className="btn btn-dark w-100 mt-2">
              <i className="bi bi-github"></i> Login with GitHub
            </button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
