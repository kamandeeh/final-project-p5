import { createContext, useState, useEffect, useContext } from "react";
import { listenForAuthChanges, logout as firebaseLogout } from "../../firebase";
import { useNavigate } from "react-router-dom";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUser(storedUser);
    }
    setLoading(false); // Set loading to false after initial check
  }, []);

  // Fetch user details using stored token - only if user is null but token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token || user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("https://final-project-p5.onrender.com/current_user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          console.warn("Unauthorized access, logging out...");
          await logout();
          return;
        }
        
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Error fetching user:", error);
        await logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  // Listen for Firebase auth changes - modified to handle auth state better
  useEffect(() => {
    let isActive = true; // Flag to prevent state updates after unmount
    
    const unsubscribe = listenForAuthChanges(async (firebaseUser) => {
      if (!isActive) return;
      
      if (firebaseUser) {
        console.log("Firebase user detected:", firebaseUser);
        
        // Get firebase ID token
        try {
          const idToken = await firebaseUser.getIdToken();
          
          if (isActive && idToken) {
            // Only try social login if we don't already have a valid user
            if (!user) {
              socialLogin(idToken);
            }
          }
        } catch (error) {
          console.error("Error getting Firebase ID token:", error);
        }
      }
    });

    return () => {
      isActive = false;
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [user]);

  // Register a new user
  const register = async (userData) => {
    try {
      const response = await fetch("https://final-project-p5.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Registration failed:", data);
        throw new Error(data.error || "Registration failed");
      }
      return { success: true, data };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    }
  };

  // Login user with email & password
  const login = async (email, password) => {
    try {
      const response = await fetch("https://final-project-p5.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("Login API response:", data);
      
      if (response.ok && data.user) {
        const userData = {
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          is_admin: data.user.is_admin || false,
        };
        console.log("User data before setting state:", userData);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", data.access_token);
        return { success: true };
      } else {
        console.error("Login failed:", data.error);
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Social login using Firebase ID token - improved error handling and logging
  const socialLogin = async (idToken) => {
    console.log("ID Token received:", idToken ? `${idToken.substring(0, 10)}...` : null);
    
    if (!idToken) {
      console.error("Error: ID Token is missing or empty!");
      return { success: false, error: "ID Token is missing" };
    }

    try {
      console.log("Making social login request...");
      const response = await fetch("https://final-project-p5.onrender.com/social_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        credentials: "include", // Ensure cookies are sent and received
      });

      console.log("Social login response status:", response.status);
      
      // Log the raw response for debugging
      const rawResponse = await response.text();
      console.log("Raw social login response:", rawResponse);
      
      // Parse the response into JSON
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        throw new Error("Invalid server response format");
      }

      if (!response.ok || !data) {
        throw new Error(data?.message || `Server error: ${response.status}`);
      }

      console.log("Social login successful:", data);
      
      // Ensure we have all required fields
      if (!data.user_id) {
        throw new Error("Server response missing user ID");
      }

      const userData = {
        id: data.user_id,
        username: data.username || "User", // Provide fallback if missing
        email: data.email,
        is_admin: data.is_admin || false,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.access_token);
      
      // Only check profile if we have a user_id
      if (data.user_id) {
        await checkUserProfile(data.user_id);
      } else {
        navigate("/profile-form");
      }
      
      return { success: true };
    } catch (error) {
      console.error("Social login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Check if user has a profile and redirect accordingly
  const checkUserProfile = async (userId) => {
    if (!userId) {
      console.error("Cannot check profile: User ID is missing");
      navigate("/profile-form");
      return;
    }
    
    try {
      console.log("Checking user profile for ID:", userId);
      const response = await fetch(`https://final-project-p5.onrender.com/profile/${userId}`);
      
      console.log("Profile check response status:", response.status);
      
      if (response.ok) {
        navigate("/");
      } else {
        navigate("/profile-form");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      navigate("/profile-form");
    }
  };

  // Update user profile
  const updateUser = async (userId, updatedData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token available for user update");
      return { success: false, error: "Authentication required" };
    }
    
    try {
      const response = await fetch(`https://final-project-p5.onrender.com/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || "Failed to update user");
      }
      
      const data = await response.json();
      console.log("User updated:", data);
      
      // Update local user data if available
      if (data.user) {
        const updatedUser = {
          ...user,
          ...data.user
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      return { success: true, data };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Try to notify the backend about logout
        try {
          await fetch("https://final-project-p5.onrender.com/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
        } catch (e) {
          console.warn("Failed to notify server about logout:", e);
        }
      }
      
      // Always clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Try Firebase logout
      try {
        await firebaseLogout();
      } catch (error) {
        console.error("Firebase Logout Error:", error);
      }
      
      // Always clear user state
      setUser(null);
      
      return { success: true };
    } catch (error) {
      console.error("Logout Error:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        socialLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};