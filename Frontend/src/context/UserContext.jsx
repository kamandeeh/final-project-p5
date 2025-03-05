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
  }, []);

  // Fetch user details using stored token
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found, logging out...");
        logout();
        return;
      }

      try {
        const response = await fetch("https://final-project-p5.onrender.com/current_user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.warn("Unauthorized access, logging out...");
          logout();
          return;
        }

        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Save user in localStorage
      } catch (error) {
        console.error("Error fetching user:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Listen for Firebase auth changes
  useEffect(() => {
    const unsubscribe = listenForAuthChanges((firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase user detected:", firebaseUser);
        setUser(firebaseUser);
      } else {
        console.warn("No Firebase user, logging out...");
        logout();
      }
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

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

  // Social login using Firebase ID token
  const socialLogin = async (idToken) => {
    console.log("ID Token received:", idToken);

    if (!idToken) {
      console.error("Error: ID Token is missing or empty!");
      return { success: false, error: "ID Token is missing" };
    }

    try {
      const response = await fetch("https://final-project-p5.onrender.com/social_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data) {
        throw new Error(data?.message || `Server error: ${response.status}`);
      }

      console.log("Social login successful:", data);

      const userData = {
        id: data.user_id,
        username: data.username,
        email: data.email,
        is_admin: data.is_admin,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.access_token);

      await checkUserProfile(data.user_id); // Redirect user accordingly

      return { success: true };
    } catch (error) {
      console.error("Social login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Check if user has a profile and redirect accordingly
  const checkUserProfile = async (userId) => {
    try {
      const response = await fetch(`https://final-project-p5.onrender.com/profile/${userId}`);
      if (response.ok) {
        navigate("/");
      } else {
        navigate("/profile-form");
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }
  };

  // Update user profile
  const updateUser = async (userId, updatedData) => {
    const token = localStorage.getItem("token");

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
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      console.log("User updated:", data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Logout user
  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    try {
      await firebaseLogout();
    } catch (error) {
      console.error("Logout Error:", error);
    }

    setUser(null);
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
