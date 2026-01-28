import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  permissions: string[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl.replace("/api", "")}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.non_field_errors
          ? errorData.non_field_errors[0]
          : "Error desconocido";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const { access, first_name, last_name, permissions } = data;

      const userData: User = {
        id: data.user_id,
        email,
        first_name,
        last_name,
        permissions,
      };

      setToken(access);
      setUser(userData);
      setIsLoggedIn(true);

      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const usePermissions = () => {
  const { user } = useAuth();
  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) ?? false;
  };
  return { hasPermission };
};

export const useApi = () => {
  const { token } = useAuth();

  const apiFetch = async (url: string, options: RequestInit = {}) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`${apiUrl}${url}`, {
      ...options,
      headers,
    });
  };

  return { apiFetch };
};
