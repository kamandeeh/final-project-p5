import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { signInWithGoogle, signInWithGithub, handleRedirectResult, listenForAuthChanges } from "../../firebase";
import { BsGoogle, BsGithub } from "react-icons/bs";

const Login = () => {
  const { user, setUser, login } = useUser(); 
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    handleRedirectResult(setUser); // Handle redirected login users
    listenForAuthChanges(setUser); // Listen for auth state changes
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/profile-form"); // Redirect logged-in users
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/profile-form");
      } else {
        throw new Error(result.error || "Login failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-3">Login</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
        <hr />
        <p className="text-center">Or login with:</p>
        <div className="d-flex justify-content-center">
          <button 
            className="btn btn-danger me-2 d-flex align-items-center"
            onClick={signInWithGoogle}
          >
            <BsGoogle className="me-2" /> Google
          </button>
          <button 
            className="btn btn-dark d-flex align-items-center"
            onClick={signInWithGithub}
          >
            <BsGithub className="me-2" /> GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
