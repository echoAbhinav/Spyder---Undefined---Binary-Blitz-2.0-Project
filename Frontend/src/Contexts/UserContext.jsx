import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(true); // Set to true to skip authentication for now
  const [loading, setLoading] = useState(false);

  const serverUrl = "http://localhost:3000";

  // Removed authentication check for now since it's not implemented in the backend
  useEffect(() => {
    // Initialize any user context data here if needed
  }, []);

  const logout = () => {
    setUser(false);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
