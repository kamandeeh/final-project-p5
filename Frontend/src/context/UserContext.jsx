import { createContext, useState, useEffect, useContext } from "react";
import { listenForAuthChanges, logout as firebaseLogout } from "../../firebase";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.warn("No token found, logging out...");
        logout(); // Ensure user is logged out if no token exists
        return;
      }
  
      try {
        const response = await fetch("http://127.0.0.1:5000/current_user", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          console.warn("Unauthorized access, logging out...");
          logout(); // Logout user if the token is invalid or expired
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  
  useEffect(() => {
    const unsubscribe = listenForAuthChanges(setUser);
    
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    console.log("Current User:", user);
  }, [user]);

  const register = async (userData, navigate) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log("Server Response:", data);  // Debugging
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      localStorage.setItem("token", data.access_token);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      return { success: true, data };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };
  

  const logout = async (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  
    try {
      await firebaseLogout();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  
    setUser(null); // Reset user state here
    if (navigate) navigate("/login");
  };
  
  return (
    <UserContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
