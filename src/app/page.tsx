"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Home, LogOut, Wifi, WifiOff } from "lucide-react";
import { AdminDashboard } from "@/components/AdminDashboard";
import { LoginForm } from "@/components/LoginForm";
import { PortalLoadingState } from "@/components/PortalLoadingState";
import { PortalView } from "@/components/PortalView";
import { MOCK_LISTINGS } from "@/data/mock-listings";
import {
  deleteListingFromSupabase,
  fetchListingsFromSupabase,
  getAuthSession,
  insertListingToSupabase,
  isSupabaseConfigured,
  onAuthStateChange,
  signOut,
} from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { DataSource, Listing, ListingInput } from "@/types/listing";

function newLocalId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [dataSource, setDataSource] = useState<DataSource>("mock");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const supabaseReady = isSupabaseConfigured();
  const isAuthenticated = Boolean(user);
  const appLoading = authLoading || listingsLoading;

  useEffect(() => {
    let cancelled = false;

    async function initAuth() {
      if (!supabaseReady) {
        if (!cancelled) {
          setUser(null);
          setAuthLoading(false);
        }
        return;
      }

      const { user: initialUser } = await getAuthSession();
      if (!cancelled) {
        setUser(initialUser);
        setAuthLoading(false);
      }
    }

    initAuth();

    const unsubscribe = onAuthStateChange(({ user: nextUser }) => {
      if (!cancelled) setUser(nextUser);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [supabaseReady]);

  useEffect(() => {
    let cancelled = false;

    async function loadListings() {
      setListingsLoading(true);
      setStatusMessage(null);

      if (!supabaseReady) {
        if (!cancelled) {
          setListings(MOCK_LISTINGS);
          setDataSource("mock");
          setStatusMessage("Using mock data — add Supabase env vars to connect.");
          setListingsLoading(false);
        }
        return;
      }

      const result = await fetchListingsFromSupabase();
      if (cancelled) return;

      if (result.source === "supabase" && result.data.length > 0) {
        setListings(result.data);
        setDataSource("supabase");
      } else if (result.source === "supabase") {
        setListings([]);
        setDataSource("supabase");
        setStatusMessage("Connected to Supabase — no listings yet.");
      } else {
        setListings(MOCK_LISTINGS);
        setDataSource("mock");
        setStatusMessage(
          result.error
            ? `Supabase unavailable (${result.error}). Using mock data.`
            : "Using mock data."
        );
      }

      setListingsLoading(false);
    }

    loadListings();
    return () => {
      cancelled = true;
    };
  }, [supabaseReady]);

  async function handleAdd(input: ListingInput) {
    setStatusMessage(null);

    if (dataSource === "supabase" && supabaseReady) {
      const { data, error } = await insertListingToSupabase(input);
      if (error || !data) {
        setStatusMessage(error ?? "Failed to add listing.");
        return;
      }
      setListings((prev) => [data, ...prev]);
      setStatusMessage("Listing saved to Supabase.");
      return;
    }

    setListings((prev) => [{ id: newLocalId(), ...input }, ...prev]);
    setStatusMessage("Listing added locally (mock mode).");
  }

  async function handleDelete(id: string) {
    setStatusMessage(null);

    if (dataSource === "supabase" && supabaseReady) {
      const result = await deleteListingFromSupabase(id);
      if (!result.ok) {
        setStatusMessage(result.error ?? "Failed to delete listing.");
        return;
      }
    }

    setListings((prev) => prev.filter((l) => l.id !== id));
    setStatusMessage(
      dataSource === "supabase" ? "Listing removed from Supabase." : "Listing removed locally."
    );
  }

  async function handleLogout() {
    setStatusMessage(null);
    setLoggingOut(true);
    const { error } = await signOut();
    setLoggingOut(false);
    if (error) {
      setStatusMessage(error);
      return;
    }
    setStatusMessage("Signed out.");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">Homestead</h1>
                <p className="text-xs text-slate-500">
                  {isAuthenticated ? "Admin" : "Tricity · Chandigarh Region"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:items-end">
              <div className="flex flex-wrap items-center gap-3">
                <DataBadge source={dataSource} />
                {isAuthenticated ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-slate-600">{user?.email}</span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      <LogOut className="h-4 w-4" />
                      {loggingOut ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                ) : (
                  <LoginForm
                    disabled={!supabaseReady}
                    onError={(message) => setStatusMessage(message)}
                    onSuccess={() => setStatusMessage(null)}
                  />
                )}
              </div>
              {!isAuthenticated && !supabaseReady && (
                <p className="text-xs text-slate-500">
                  Admin sign-in requires Supabase env vars.
                </p>
              )}
            </div>
          </div>

          {statusMessage && (
            <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
              {statusMessage}
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {appLoading ? (
          isAuthenticated ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            </div>
          ) : (
            <PortalLoadingState />
          )
        ) : isAuthenticated ? (
          <AdminDashboard listings={listings} onAdd={handleAdd} onDelete={handleDelete} />
        ) : (
          <PortalView listings={listings} />
        )}
      </main>
    </div>
  );
}

function DataBadge({ source }: { source: DataSource }) {
  const connected = source === "supabase";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1",
        connected
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-slate-100 text-slate-600 ring-slate-200"
      )}
    >
      {connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      {connected ? "Supabase" : "Mock data"}
    </span>
  );
}
