import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔹 Fetch current user on app load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return; // No token, no request

      try {
        const response = await fetch("http://127.0.0.1:5000/current_user", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          logout(); // Token invalid? Auto logout
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        logout();
      }
    };

    fetchCurrentUser();
  }, []);

  // 🔹 Login function
  const login = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        await fetchCurrentUser(); // Refresh user state
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Server error" };
    }
  };

  // 🔹 Register function
  const register = async (username, email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Server error" };
    }
  };

  // 🔹 Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      await fetch("http://127.0.0.1:5000/logout", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("access_token");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook for accessing context
export const useUser = () => {
  return useContext(UserContext);
};
