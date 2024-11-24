import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  const serverUrl = "https://localhost:3000";

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;

      axios
        .post(
          `${serverUrl}/api/v1/auth/check`,
          {},
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data.user);
            setUser(response.data.user);
          }
        })
        .catch((error) => {
          console.log("User is not authenticated:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const logout = () => {
    axios
      .post(
        `${serverUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setUser(false);
      })
      .catch((error) => {
        console.log("Error logging out:", error);
      });
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
