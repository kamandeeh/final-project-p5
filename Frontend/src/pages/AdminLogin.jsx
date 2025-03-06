import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        // Updated to match the route in your Flask app
        const response = await fetch("http://127.0.0.1:5000/admin/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
          });
          
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }
      
      const data = await response.json();
      const { token, is_admin } = data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("is_admin", is_admin);
      
      if (is_admin) {
        navigate("/admin-dashboard");
      } else {
        setError("Access Denied: You are not an admin.");
      }
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Admin Login</h2>
          {error && <p className="text-danger text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Email" 
                required 
                className="form-control" 
                disabled={isLoading}
              />
            </div>
            <div className="mb-3">
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Password" 
                required 
                className="form-control" 
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;