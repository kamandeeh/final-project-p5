import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signInWithGithub } from "../../firebase";
import { BsGoogle, BsGithub } from "react-icons/bs";

const Login = () => {
  const { login } = useUser(); 
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!login) {
      console.error("Login function is undefined");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Google Login Success:", user);
      navigate("/");
    } catch (err) {
      setError("Google authentication failed.");
      console.error(err);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const user = await signInWithGithub();
      console.log("GitHub Login Success:", user);
      navigate("/");
    } catch (err) {
      setError("GitHub authentication failed.");
      console.error(err);
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
          <button className="btn btn-danger me-2" onClick={handleGoogleLogin}>
            <BsGoogle /> Continue with Google
          </button>
          <button className="btn btn-dark" onClick={handleGithubLogin}>
            <BsGithub /> Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
