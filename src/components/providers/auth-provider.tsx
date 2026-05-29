"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { DemoUser, SavedResource, ViewedResource } from "@/lib/types";

type AuthContextValue = {
  user: DemoUser | null;
  saved: SavedResource[];
  history: ViewedResource[];
  login: (payload: DemoUser) => void;
  logout: () => void;
  toggleSaved: (resourceId: string) => void;
  recordView: (resourceId: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEYS = {
  user: "resourcehive-user",
  saved: "resourcehive-saved",
  history: "resourcehive-history",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const savedUser = localStorage.getItem(STORAGE_KEYS.user);
    return savedUser ? (JSON.parse(savedUser) as DemoUser) : null;
  });
  const [saved, setSaved] = useState<SavedResource[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedResources = localStorage.getItem(STORAGE_KEYS.saved);
    return savedResources ? (JSON.parse(savedResources) as SavedResource[]) : [];
  });
  const [history, setHistory] = useState<ViewedResource[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const savedHistory = localStorage.getItem(STORAGE_KEYS.history);
    return savedHistory ? (JSON.parse(savedHistory) as ViewedResource[]) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  }, [history]);

  const login = useCallback((payload: DemoUser) => {
    setUser(payload);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(payload));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.user);
  }, []);

  const toggleSaved = useCallback((resourceId: string) => {
    setSaved((current) => {
      const exists = current.some((item) => item.resourceId === resourceId);
      if (exists) {
        return current.filter((item) => item.resourceId !== resourceId);
      }

      return [{ resourceId, savedAt: new Date().toISOString() }, ...current];
    });
  }, []);

  const recordView = useCallback((resourceId: string) => {
    setHistory((current) => {
      const next = current.filter((item) => item.resourceId !== resourceId);
      return [{ resourceId, viewedAt: new Date().toISOString() }, ...next].slice(0, 12);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      saved,
      history,
      login,
      logout,
      toggleSaved,
      recordView,
    }),
    [history, login, logout, recordView, saved, toggleSaved, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
