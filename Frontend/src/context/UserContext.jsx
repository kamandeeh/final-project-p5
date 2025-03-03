import { createContext, useState, useEffect, useContext } from "react";
import { listenForAuthChanges, logout as firebaseLogout } from "../../firebase";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

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
        const response = await fetch("http://127.0.0.1:5000/current_user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.warn("Unauthorized access, logging out...");
          logout();
          return;
        }

        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
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

  const register = async (userData) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
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

  const login = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (!data.access_token) {
        throw new Error("No access token received");
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
  const socialLogin = async (idToken) => {
    if (!idToken) {
      console.error("🚨 Error: ID Token is missing or empty!");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:5000/social_login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({ id_token: idToken }),
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Login successful:", data);
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  
  
  

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
    <UserContext.Provider value={{ user, setUser, loading, login, register, socialLogin, logout }}>
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
