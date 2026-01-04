import { createContext, useEffect, useState } from "react";
import { getMe } from "../api/auth.api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = (token) => {
    localStorage.setItem("token", token);
    window.location.href = "/dashboard";
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
