import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signInWithGithub } from "../../firebase";
import { BsGoogle, BsGithub } from "react-icons/bs";

const SignupPage = () => {
  const { register } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const userData = { username, email, password };
    await register(userData, navigate);
  };

  const handleSocialAuth = async (provider, providerName) => {
    try {
      const user = await provider();
      if (user) {
        const response = await fetch("http://127.0.0.1:5000/social_login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.displayName || "", 
            email: user.email,
            provider: providerName,
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to store user data");
        }

        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-3">Sign Up</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
        <div className="d-flex justify-content-center mt-3 gap-2">
          <button 
            onClick={() => handleSocialAuth(signInWithGoogle, "google")} 
            className="btn btn-danger w-50 d-flex align-items-center justify-content-center"
          >
            <BsGoogle className="me-2" /> Google
          </button>
          <button 
            onClick={() => handleSocialAuth(signInWithGithub, "github")} 
            className="btn btn-dark w-50 d-flex align-items-center justify-content-center"
          >
            <BsGithub className="me-2" /> GitHub
          </button>
        </div>
        <p className="text-center mt-3">
          Already have an account? <a href="/login" className="text-primary">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
