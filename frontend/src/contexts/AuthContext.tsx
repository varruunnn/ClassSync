import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  schoolId: number | null;
  login: (role: string, schoolId: number) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/auth/me", { withCredentials: true })
      .then((res) => {
        setIsAuthenticated(true);
        setUserRole(res.data.role);
        setSchoolId(res.data.schoolId);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUserRole(null);
        setSchoolId(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (role: string, sid: number) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setSchoolId(sid);
    localStorage.setItem("role", role);
    localStorage.setItem("schoolId", sid.toString());
  };

  const logout = () => {
    axios
      .post(
        "http://localhost:3001/api/auth/logout",
        {},
        { withCredentials: true }
      )
      .finally(() => {
        setIsAuthenticated(false);
        setUserRole(null);
        setSchoolId(null);
        localStorage.removeItem("role");
        localStorage.removeItem("schoolId");
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        schoolId,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
