"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/context/AuthProvider";
import { isSupabaseConfigured } from "@/lib/supabase";
import { MOCK_LISTINGS } from "@/data/mock-listings";
import { listingImage } from "@/lib/utils";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/buy";
  const { isAuthenticated, loading, isAdmin, isBuyer } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Role-based redirect logic
      if (isAdmin) {
        // Admin users go to /admin (unless they're trying to access a specific admin page)
        if (redirect.startsWith("/admin")) {
          router.replace(redirect);
        } else {
          router.replace("/admin");
        }
      } else if (isBuyer) {
        // Buyer users can access protected routes or default to /buy
        if (
          redirect.startsWith("/property/") ||
          redirect === "/saved-properties" ||
          redirect === "/buy"
        ) {
          router.replace(redirect);
        } else {
          // Safety fallback for buyers
          router.replace("/buy");
        }
      }
    }
  }, [loading, isAuthenticated, isAdmin, isBuyer, redirect, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background blur effect with property cards */}
      <div className="absolute inset-0 scale-105 blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-8 opacity-60 md:grid-cols-2 lg:grid-cols-3">
          {[...MOCK_LISTINGS, ...MOCK_LISTINGS].slice(0, 9).map((listing, i) => (
            <div key={`${listing.id}-${i}`} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
              <div className="aspect-[4/3] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listingImage(listing.image_url)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dark overlay with backdrop blur */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" />

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 backdrop-blur-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Home button */}
      <Link
        href="/"
        className="absolute right-4 top-4 z-20 inline-flex items-center justify-center h-10 w-10 rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
      >
        <Home className="h-5 w-5" />
      </Link>

      {/* Login card centered */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 text-center shadow-2xl ring-1 ring-white/60 backdrop-blur-md sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            Sign in
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Access saved properties, contact dealers, and manage listings
          </p>

          {!isSupabaseConfigured() ? (
            <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
              Supabase is not configured. Add env vars to enable authentication.
            </div>
          ) : (
            <div className="mt-8">
              <LoginForm
                layout="stacked"
                onSuccess={() => router.replace(redirect)}
              />
            </div>
          )}

          <div className="mt-6 space-y-2">
            <p className="text-sm text-slate-500">
              Don't want to sign in?
            </p>
            <Link
              href="/buy"
              className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
            >
              Browse as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-900">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
