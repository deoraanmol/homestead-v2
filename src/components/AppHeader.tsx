"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, LogOut, User, ChevronDown, Shield, ShoppingBag, Store } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { cn } from "@/lib/utils";

type Props = {
  statusMessage?: string | null;
};

export function AppHeader({ statusMessage }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAdmin, isBuyer, isAuthenticated, signOut, loading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read real-time selection parameters matching global location context
  const activeCity = searchParams.get("city") || "Chandigarh";
  const activeRegion = searchParams.get("region") || "Tricity";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
    setDropdownOpen(false);
  }

  const role = (() => {
    if (isAdmin) return { label: "Admin", icon: <Shield className="h-3 w-3" /> };
    if (isBuyer) return { label: "Client", icon: <ShoppingBag className="h-3 w-3" /> };
    return { label: "Dealer", icon: <Store className="h-3 w-3" /> };
  })();

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={cn(
        "flex-1 md:flex-none text-center rounded-lg px-4 py-1.5 text-sm font-semibold transition-all duration-200",
        pathname === href || pathname.startsWith(`${href}/`)
          ? "bg-emerald text-white shadow-sm"
          : "text-neutral hover:bg-neutral-light hover:text-neutral-dark"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-neutral/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:grid md:grid-cols-3 items-center py-3 md:py-0 md:h-16 gap-3 md:gap-0">
          
          {/* Branding Sub-Block featuring Dynamic Location Text Parsing */}
          <div className="flex items-center justify-between w-full md:w-auto md:justify-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald text-white shadow-lg shadow-emerald/25 transition-transform group-hover:scale-105">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-md font-bold tracking-tight text-neutral-dark leading-none">Homestead</h1>
                <p className="text-[10px] font-semibold text-emerald mt-1 tracking-wide capitalize">
                  {activeRegion} · {activeCity}
                </p>
              </div>
            </Link>

            <div className="md:hidden flex items-center">
              {renderUserActions()}
            </div>
          </div>

          <div className="flex items-center justify-center w-full md:w-auto">
            <nav className="inline-flex w-full md:w-auto items-center gap-1 bg-neutral-light p-1 rounded-xl border border-neutral/5">
              {navLink("/buy", "Buy")}
              {navLink("/dealers", "Sell")}
            </nav>
          </div>

          <div className="hidden md:flex items-center justify-end">
            {renderUserActions()}
          </div>

        </div>
      </div>
      
      {statusMessage && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-3">
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
            {statusMessage}
          </p>
        </div>
      )}
    </header>
  );

  function renderUserActions() {
    if (loading) return null;
    if (!isAuthenticated) {
      return (
        <Link href="/login" className="btn-primary px-4 py-2 text-sm">
          Sign in
        </Link>
      );
    }

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 rounded-xl p-1 transition hover:bg-neutral-light focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald text-white font-bold text-sm shadow-sm">
            {user?.email ? user.email.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
          </div>
          <ChevronDown className={cn("h-4 w-4 text-neutral transition-transform duration-200", dropdownOpen && "rotate-180")} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl border border-neutral/10 bg-background p-1.5 shadow-xl animate-in fade-in slide-in-from-top-1 duration-100">
            <div className="px-3 py-2.5 border-b border-neutral/5">
              <p className="text-[10px] font-medium text-neutral tracking-wide uppercase">Account Profile</p>
              <p className="truncate text-sm font-semibold text-neutral-dark mt-0.5">{user?.email}</p>
              <p className="text-[11px] font-mono text-neutral mt-0.5">ID: {user?.id?.substring(0, 8) || "Guest"}</p>
              <span className="inline-flex items-center gap-1 mt-2 rounded-md bg-neutral-light px-2 py-0.5 text-xs font-semibold text-neutral-dark border border-neutral/10">
                {role.icon}
                {role.label}
              </span>
            </div>

            <div className="mt-1 space-y-0.5">
              {isBuyer && (
                <Link
                  href="/saved-properties"
                  onClick={() => setDropdownOpen(false)}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-neutral-dark hover:bg-neutral-light transition"
                >
                  Saved Properties
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setDropdownOpen(false)}
                  className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-emerald font-semibold hover:bg-emerald-light transition"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>

            <div className="mt-1 pt-1 border-t border-neutral/5">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-60 text-left"
              >
                <LogOut className="h-4 w-4" />
                {loggingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}