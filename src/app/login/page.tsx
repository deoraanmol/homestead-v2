"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/context/AuthProvider";
import { isSupabaseConfigured } from "@/lib/supabase";

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
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
      <p className="mt-2 text-sm text-slate-500">
        Sign in to view property details, save homes, and contact dealers.
      </p>

      {!isSupabaseConfigured() ? (
        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          Supabase is not configured. Add env vars to enable authentication.
        </p>
      ) : (
        <div className="mt-6">
          <LoginForm
            layout="stacked"
            onSuccess={() => router.replace(redirect)}
          />
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/buy" className="font-medium text-brand-700 hover:underline">
          Continue browsing without signing in
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            </div>
          }
        >
          <LoginContent />
        </Suspense>
      </main>
    </div>
  );
}
