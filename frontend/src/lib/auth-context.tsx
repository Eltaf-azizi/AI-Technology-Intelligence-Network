"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { auth } from "./api";

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("atin_access_token");
    if (!token) { setLoading(false); return; }
    try {
      const u = await auth.me();
      setUser(u);
    } catch {
      localStorage.removeItem("atin_access_token");
      localStorage.removeItem("atin_refresh_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const login = async (username: string, password: string) => {
    const res = await auth.login({ username, password });
    localStorage.setItem("atin_access_token", res.access_token);
    localStorage.setItem("atin_refresh_token", res.refresh_token);
    setUser(res.user);
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await auth.register({ username, email, password });
    localStorage.setItem("atin_access_token", res.access_token);
    localStorage.setItem("atin_refresh_token", res.refresh_token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("atin_access_token");
    localStorage.removeItem("atin_refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
