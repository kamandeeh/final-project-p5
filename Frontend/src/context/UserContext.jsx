import { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      console.log("Stored token:", token);  
    
      if (token) {
        try {
          const response = await fetch("http://127.0.0.1:5000/current_user", {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.error("Error response:", await response.json()); // Log error details
            logout();
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          logout();
        }
      }
      setLoading(false);
    };
    
  
    fetchUser();
  }, []);
  

  // Register a new user
  const register = async (userData, navigate) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/login"); 
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
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Login failed");
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.access_token);  
      setUser(data.user);
      
      return { success: true, data };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };
  
  
  

  // Logout user
  const logout = (navigate) => {
    localStorage.removeItem("token");
    setUser(null);
    if (navigate) navigate("/login"); // ✅ Ensure navigation only if function was called with `navigate`
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
