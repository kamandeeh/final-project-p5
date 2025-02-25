import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  signInWithEmail, signInWithGoogle, signInWithGithub 
} from "../../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";

  // Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const user = await signInWithEmail(form.email, form.password);
      if (user) {
        localStorage.setItem("token", user.accessToken);
        navigate(redirectPath);
        window.location.reload();
      } else {
        setError("Login failed. Check your credentials.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        localStorage.setItem("token", user.accessToken);
        navigate(redirectPath);
        window.location.reload();
      }
    } catch (err) {
      setError("Google authentication failed.");
    }
  };

  // Handle GitHub Login
  const handleGitHubLogin = async () => {
    try {
      const user = await signInWithGithub();
      if (user) {
        localStorage.setItem("token", user.accessToken);
        navigate(redirectPath);
        window.location.reload();
      }
    } catch (err) {
      setError("GitHub authentication failed.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(to right, #22FFCC, #E1EECC)" }}>
      
      <div className="card shadow p-4 bg-white" style={{ width: "22rem", borderRadius: "10px" }}>
        
        <h2 className="text-center mb-3">Login</h2>
        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              required className="form-control" 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
              required className="form-control" 
            />
          </div>
          <button type="submit" className="btn btn-warning w-100">
            Login
          </button>
        </form>

        {/* Google Login Button */}
        <div className="mt-3 text-center">
          <button onClick={handleGoogleLogin} className="btn btn-danger w-100">
            <i className="bi bi-google"></i> Login with Google
          </button>
        </div>

        {/* GitHub Login Button */}
        <div className="mt-3 text-center">
          <button onClick={handleGitHubLogin} className="btn btn-dark w-100">
            <i className="bi bi-github"></i> Login with GitHub
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
