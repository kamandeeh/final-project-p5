import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  signUpWithEmail, signInWithGoogle, signInWithGithub 
} from "../../firebase"; 
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
      const user = await signUpWithEmail(email, password);
      if (user) {
        localStorage.setItem("token", user.accessToken);
        navigate("/login");
      } else {
        setError("Signup failed. Try again.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Google Signup
  const handleGoogleSignup = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        localStorage.setItem("token", user.accessToken);
        navigate("/login");
      }
    } catch (err) {
      console.error("Google Signup Failed", err);
    }
  };

  // Handle GitHub Signup
  const handleGitHubSignup = async () => {
    try {
      const user = await signInWithGithub();
      if (user) {
        localStorage.setItem("token", user.accessToken);
        navigate("/login");
      }
    } catch (err) {
      console.error("GitHub Signup Failed", err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" 
      style={{ background: "linear-gradient(to right, #2FC, #e1EC)" }}>
      
      <div className="card shadow p-4 bg-white" 
        style={{ width: "22rem", borderRadius: "10px" }}>
        
        <h2 className="text-center mb-3 text-black">Sign Up</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input 
              type="text" value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required className="form-control" 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required className="form-control" 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required className="form-control" 
            />
          </div>
          <button type="submit" className="btn btn-warning w-100">
            Sign Up
          </button>
        </form>

        {/* Google Signup Button */}
        <div className="mt-3 text-center">
          <button onClick={handleGoogleSignup} className="btn btn-danger w-100">
            <i className="bi bi-google"></i> Sign Up with Google
          </button>
        </div>

        {/* GitHub Signup Button */}
        <div className="mt-3 text-center">
          <button onClick={handleGitHubSignup} className="btn btn-dark w-100">
            <i className="bi bi-github"></i> Sign Up with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
