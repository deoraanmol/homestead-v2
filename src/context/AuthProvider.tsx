"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  ensureUserProfile,
  getAuthSession,
  isSupabaseConfigured,
  onAuthStateChange,
  signOut as supabaseSignOut,
} from "@/lib/supabase";
import type { UserRole } from "@/types/user";

type AuthContextValue = {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBuyer: boolean;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshRole = useCallback(async (nextUser: User | null = user) => {
    if (!nextUser || !isSupabaseConfigured()) {
      setRole(null);
      return;
    }
    const nextRole = await ensureUserProfile(nextUser.id);
    setRole(nextRole);
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!isSupabaseConfigured()) {
        if (!cancelled) {
          setUser(null);
          setRole(null);
          setLoading(false);
        }
        return;
      }

      const { user: sessionUser } = await getAuthSession();
      if (cancelled) return;

      setUser(sessionUser);
      if (sessionUser) {
        const nextRole = await ensureUserProfile(sessionUser.id);
        if (!cancelled) setRole(nextRole);
      } else {
        setRole(null);
      }
      if (!cancelled) setLoading(false);
    }

    init();

    const unsubscribe = onAuthStateChange(async ({ user: nextUser }) => {
      if (cancelled) return;
      setUser(nextUser);
      if (nextUser) {
        const nextRole = await ensureUserProfile(nextUser.id);
        if (!cancelled) setRole(nextRole);
      } else {
        setRole(null);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    await supabaseSignOut();
    setUser(null);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: role === "admin",
      isBuyer: role === "buyer",
      signOut: handleSignOut,
      refreshRole: () => refreshRole(user),
    }),
    [user, role, loading, handleSignOut, refreshRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
