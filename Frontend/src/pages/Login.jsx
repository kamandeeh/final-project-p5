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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listenForAuthChanges(setUser); // Listen for auth changes and update user context
  }, []);

  useEffect(() => {
    if (user && user.id) {
      console.log("User detected, checking profile...");
      checkUserProfile(user.id);
    }
  }, [user]);

  // Function to check the user's profile status after login
  const checkUserProfile = async (userId) => {
    try {
      if (!userId) return;
      console.log("Checking profile for user ID:", userId);
      
      const response = await fetch(`https://final-project-p5.onrender.com/profile/${userId}`);
      
      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Non-JSON response received:", await response.text());
        toast.error("Server error: Invalid response format");
        return;
      }
      
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
      toast.error("Failed to verify profile. Please try again.");
    }
  };

 // In your Login component
 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    // Log what's being sent
    console.log("Sending login request with:", { email, password });

    const response = await fetch("https://final-project-p5.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const contentType = response.headers.get("content-type");
    console.log("Server responded with content type:", contentType);

    // Handle non-JSON responses
    const text = await response.text();
    console.log("Raw server response:", text);

    // Ensure JSON response
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned non-JSON response.");
    }

    const data = JSON.parse(text);

    if (!response.ok) {
      throw new Error(data.error || "Login failed. Please try again.");
    }

    setUser(data.user); 
    toast.success("Login successful!");

    checkUserProfile(data.user.id);

  } catch (err) {
    console.error("Login failed:", err);
    setError("Failed to login. Please check your credentials or try again later.");
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleSocialAuth = async (provider) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (provider === "google") {
        result = await signInWithGoogle();
      } else if (provider === "github") {
        result = await signInWithGithub();
      }
  
      if (!result || !result.user) {
        throw new Error("❌ Social login failed: No user data received.");
      }
  
      const { email, displayName, uid } = result.user;
      console.log("✅ User info from Firebase:", { email, displayName, uid });
  
      try {
        const response = await fetch("https://final-project-p5.onrender.com/social_login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            username: displayName || "Anonymous",
            uid,
          }),
        });
    
        // Check if the response status is OK and the content type is JSON
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          console.error(`Server error: ${response.status} ${response.statusText}`);
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Server error: ${response.status}. Please contact support.`);
        }
        
        if (!contentType || !contentType.includes("application/json")) {
          const textResponse = await response.text();
          console.error("Non-JSON response:", textResponse);
          throw new Error("Server returned invalid format. Please try again later.");
        }
    
        const data = await response.json();
        console.log("✅ Parsed Backend Response:", data);
    
        if (data.user_id) {
          setUser({ id: data.user_id, email });
          toast.success("🎉 Social login successful!");
          checkUserProfile(data.user_id);
        } else {
          throw new Error(data.error || "❌ Social login failed.");
        }
      } catch (fetchError) {
        console.error("❌ Backend Request Error:", fetchError);
        throw new Error(`Server communication error: ${fetchError.message}`);
      }
    } catch (error) {
      console.error("❌ Social Login Error:", error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-3">Login</h2>
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>
        <hr />
        <p className="text-center">Or login with:</p>
        <button
          className="btn btn-danger me-2 d-flex align-items-center justify-content-center w-100 mb-2"
          onClick={() => handleSocialAuth("google")}
          disabled={loading}
        >
          <BsGoogle className="me-2" /> Sign in with Google
        </button>
        <button
          className="btn btn-dark d-flex align-items-center justify-content-center w-100"
          onClick={() => handleSocialAuth("github")}
          disabled={loading}
        >
          <BsGithub className="me-2" /> Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;