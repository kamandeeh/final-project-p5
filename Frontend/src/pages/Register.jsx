import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (response) => {
    const res = await fetch("http://127.0.0.1:5000/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential }),
    });
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      navigate("/login");
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = "http://127.0.0.1:5000/api/auth/github";
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{
        background: "linear-gradient(to right, #4682B4, #5A9BD5)", 
      }}>
      <div className="card shadow p-4 bg-white" style={{ width: "22rem", borderRadius: "10px", background: "linear-gradient(to right, #2FC, #e1EC)" }}>
        <h2 className="text-center mb-3 text-light">Sign Up</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control" />
          </div>
          <button type="submit" className="btn btn-warning w-100" >Sign Up</button>
        </form>
        <div className="mt-3 text-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log("Google Signup Failed")} />
        </div>
        <div className="mt-3 text-center ">
          <button onClick={handleGitHubLogin} className="btn btn-dark w-100">
            <i className="bi bi-github"></i> Sign Up with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
