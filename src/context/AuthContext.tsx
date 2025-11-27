import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthState, Credentials, User } from "../types/auth";
import { authService } from "../services/authService";

interface AuthContextValue extends AuthState {
  login: (credentials: Credentials, options?: { remember?: boolean }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = "zenta_auth_state";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const fromLocal = localStorage.getItem(AUTH_STORAGE_KEY);
    const fromSession = !fromLocal ? sessionStorage.getItem(AUTH_STORAGE_KEY) : null;
    const source = fromLocal ?? fromSession;
    if (source) {
      try {
        return JSON.parse(source) as AuthState;
      } catch {
        return { isAuthenticated: false };
      }
    }
    return { isAuthenticated: false };
  });
  const [storageTarget, setStorageTarget] = useState<"local" | "session">(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) ? "local" : sessionStorage.getItem(AUTH_STORAGE_KEY) ? "session" : "local";
  });

  useEffect(() => {
    const data = JSON.stringify(state);
    if (storageTarget === "local") {
      localStorage.setItem(AUTH_STORAGE_KEY, data);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, data);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [state, storageTarget]);

  const login = useCallback(async (credentials: Credentials, options?: { remember?: boolean }) => {
    const { token, user } = await authService.login(credentials);
    setStorageTarget(options?.remember ? "local" : "session");
    setState({ isAuthenticated: true, token, user });
  }, []);

  const logout = useCallback(() => {
    setState({ isAuthenticated: false });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};


