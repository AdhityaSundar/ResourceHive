"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DemoUser, SavedResource, ViewedResource } from "@/lib/types";

type AuthContextValue = {
  user: DemoUser | null;
  saved: SavedResource[];
  history: ViewedResource[];
  logout: () => Promise<void>;
  toggleSaved: (resourceId: string) => void;
  recordView: (resourceId: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEYS = {
  saved: "resourcehive-saved",
  history: "resourcehive-history",
};

type SupabaseUserish = {
  email?: string | null;
  user_metadata?: { full_name?: string } | null;
} | null;

function toDemoUser(user: SupabaseUserish): DemoUser | null {
  if (!user) return null;
  const name = user.user_metadata?.full_name || (user.email ? user.email.split("@")[0] : "Member");
  return { name, email: user.email ?? "" };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [saved, setSaved] = useState<SavedResource[]>(() => {
    if (typeof window === "undefined") return [];
    const value = localStorage.getItem(STORAGE_KEYS.saved);
    return value ? (JSON.parse(value) as SavedResource[]) : [];
  });
  const [history, setHistory] = useState<ViewedResource[]>(() => {
    if (typeof window === "undefined") return [];
    const value = localStorage.getItem(STORAGE_KEYS.history);
    return value ? (JSON.parse(value) as ViewedResource[]) : [];
  });

  // Real auth via Supabase (only when configured; otherwise everyone is signed out).
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(toDemoUser(data.user));
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toDemoUser(session?.user ?? null));
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  }, [history]);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await createClient().auth.signOut();
    }
    setUser(null);
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
    () => ({ user, saved, history, logout, toggleSaved, recordView }),
    [user, saved, history, logout, toggleSaved, recordView],
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
