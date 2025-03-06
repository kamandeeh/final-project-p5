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
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    const userData = { username, email, password };
  
    try {
      const success = await register(userData);
      if (success) {
        setSuccess("Registration successful! Redirecting...");
        setTimeout(() => {
          alert("Login Successful!!")
          navigate("/login"); 
        }, 2000); // Show success message for 2 seconds before redirecting
      }
    } catch (error) {
      setError("Signup failed. Please try again.");
    }
  };

  const handleSocialAuth = async (provider, providerName) => {
    try {
      const user = await provider();
      if (user) {
        console.log("Social auth user:", user); // Debugging  
  
        const response = await fetch("https://final-project-p5.onrender.com/social_login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.displayName || "", 
            email: user.email,
            uid: user.uid,  // Add this line
            provider: providerName,
          }),
        });
  
        const responseData = await response.json();
        console.log("Backend response:", responseData); // Debugging  
  
        if (!response.ok) {
          throw new Error(responseData.error || "Failed to store user data");
        }
  
        setSuccess("Signup successful! Redirecting...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Social auth error:", err); // Debugging
      setError(err.message);
    }
  };
  

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-3">Sign Up</h2>
        
        {success && <div className="alert alert-success text-center">{success}</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

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
