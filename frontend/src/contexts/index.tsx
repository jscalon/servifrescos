import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = localStorage.getItem("isLoggedIn");
    return stored === "true";
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName");
  });

  const login = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
