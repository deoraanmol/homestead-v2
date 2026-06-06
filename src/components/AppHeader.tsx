"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { cn } from "@/lib/utils";

type Props = {
  statusMessage?: string | null;
};

export function AppHeader({ statusMessage }: Props) {
  const pathname = usePathname();
  const { user, isAdmin, isBuyer, isAuthenticated, signOut, loading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
  }

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition",
        pathname === href || pathname.startsWith(`${href}/`)
          ? "bg-brand-50 text-brand-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/25">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">Homestead</h1>
                <p className="text-xs text-slate-500">Tricity · Chandigarh Region</p>
              </div>
            </Link>
          </div>

          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            {navLink("/buy", "Buy")}
            {navLink("/dealers", "Sell")}
            {isBuyer && navLink("/saved-properties", "Saved")}
            {isAdmin && navLink("/admin", "Admin")}
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            {!loading && !isAuthenticated && (
              <Link href="/login" className="btn-primary px-4 py-2 text-sm">
                Sign in
              </Link>
            )}
            {!loading && isAuthenticated && (
              <>
                <span className="hidden text-sm text-slate-600 sm:inline">{user?.email}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "…" : "Sign out"}
                </button>
              </>
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
  );
}
