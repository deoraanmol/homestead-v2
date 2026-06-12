"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wifi, WifiOff } from "lucide-react";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AppHeader } from "@/components/AppHeader";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/context/AuthProvider";
import { useListings } from "@/hooks/useListings";
import {
  deleteListingFromSupabase,
  insertListingToSupabase,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { DataSource, ListingInput } from "@/types/listing";
import { AppFooter } from "@/components/AppFooter";

function newLocalId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function AdminPage() {
  const router = useRouter();
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const {
    listings,
    setListings,
    dataSource,
    loading: listingsLoading,
    statusMessage,
    setStatusMessage,
  } = useListings();

  const supabaseReady = isSupabaseConfigured();
  const appLoading = authLoading || listingsLoading;

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      // Redirect unauthenticated users to login
      router.replace("/login?redirect=/admin");
    } else if (isAuthenticated && !isAdmin) {
      // Redirect non-admin authenticated users to buy page
      router.replace("/buy");
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

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

  return (
    <div className="min-h-screen">
      <AppHeader statusMessage={statusMessage} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Manage property listings</p>
          </div>
          <DataBadge source={dataSource} />
        </div>

        {appLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : !isAuthenticated ? (
          <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Admin sign in</h2>
            <p className="mt-1 text-sm text-slate-500">
              Sign in with an admin account to manage listings.
            </p>
            {!supabaseReady ? (
              <p className="mt-4 text-sm text-amber-800">Supabase env vars required.</p>
            ) : (
              <div className="mt-4">
                <LoginForm
                  layout="stacked"
                  onError={(msg) => setStatusMessage(msg)}
                />
              </div>
            )}
            <p className="mt-4 text-center text-sm text-slate-500">
              <Link href="/buy" className="text-brand-700 hover:underline">
                Back to listings
              </Link>
            </p>
          </div>
        ) : isAdmin ? (
          <AdminDashboard listings={listings} onAdd={handleAdd} onDelete={handleDelete} />
        ) : (
          <p className="text-slate-600">Redirecting…</p>
        )}
      </main>
      <AppFooter />
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
