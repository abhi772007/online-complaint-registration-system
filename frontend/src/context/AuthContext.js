import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      if (token && !user) {
        try {
          const response = await api.get("/profile");
          login(token, response.data);
        } catch (error) {
          logout();
        }
      }
    };
    validateToken();
  }, [token, user]);

  const login = (jwtToken, userData) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;