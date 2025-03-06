// src/pages/Login.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { signInWithGoogle, signInWithGithub, listenForAuthChanges } from "../../firebase";
import { BsGoogle, BsGithub } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { user, setUser, login } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    listenForAuthChanges(setUser);
  }, []);

  useEffect(() => {
    if (user && user.id) {
      console.log("User detected, checking profile...");
      checkUserProfile(user.id);
    }
  }, [user]);

  const checkUserProfile = async (userId) => {
    try {
      if (!userId) return;

      console.log("Checking profile for user ID:", userId);
      const response = await fetch(`http://127.0.0.1:5000/profile/${userId}`);
      const data = await response.json();

      if (response.ok && data.id) {
        toast.success("Welcome back! Redirecting to home...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.info("Complete your profile before proceeding.");
        setTimeout(() => navigate("/profile-form"), 2000);
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      toast.error("Failed to verify profile.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const result = await login(email, password);
      console.log("Login response:", result);

      if (result?.success) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          console.log("Stored User after login:", storedUser);

          if (storedUser?.id) {
            checkUserProfile(storedUser.id);
          } else {
            console.error("User ID not found after login.");
            setError("Failed to retrieve user information.");
          }
        }, 1000);
      } else {
        throw new Error(result?.error || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleSocialAuth = async (provider) => {
    try {
      let result;
      if (provider === "google") {
        result = await signInWithGoogle();
      } else if (provider === "github") {
        result = await signInWithGithub();
      }

      if (!result) throw new Error("Social login failed");

      const token = await result.user.getIdToken();
      console.log("Sending request with token:", token);

      const response = await fetch("http://127.0.0.1:5000/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (response.ok && data.user_id) {
        setUser({ id: data.user_id, email: result.user.email });
        toast.success("Social login successful!");
        checkUserProfile(data.user_id);
      } else {
        throw new Error(data.message || "Social login failed");
      }
    } catch (error) {
      console.error("Social Login Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-3">Login</h2>

        {success && <div className="alert alert-success text-center">{success}</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

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

        <button
          className="btn btn-danger me-2 d-flex align-items-center w-100 mb-2"
          onClick={() => handleSocialAuth("google")}
        >
          <BsGoogle className="me-2" /> Sign in with Google
        </button>
        <button
          className="btn btn-dark d-flex align-items-center w-100"
          onClick={() => handleSocialAuth("github")}
        >
          <BsGithub className="me-2" /> Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
