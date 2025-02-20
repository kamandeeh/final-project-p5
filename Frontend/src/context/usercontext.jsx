import React, { createContext, useContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store user info

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Custom Hook for easier access
export const useUser = () => {
  return useContext(UserContext);
};
