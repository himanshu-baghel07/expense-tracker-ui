"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type User = {
  name: string;
  id?: string;
  email?: string;
  phone?: string;
  currency?: string;
  isEmailVerified?: boolean;
  avatar?: string;
} | null;

type AuthContextType = {
  user: User;
  login: (user: {
    name: string;
    id?: string;
    email?: string;
    phone?: string;
    currency?: string;
    isEmailVerified?: boolean;
    avatar?: string;
  }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  const login = useCallback(
    (user: {
      name: string;
      id?: string;
      email?: string;
      phone?: string;
      currency?: string;
      isEmailVerified?: boolean;
      avatar?: string;
    }) => {
      setUser(user);
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
