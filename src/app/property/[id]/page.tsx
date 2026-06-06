"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PropertyDetailsView } from "@/components/PropertyDetailsView";
import { resolveListingById } from "@/lib/get-listing";
import { useAuth } from "@/context/AuthProvider";
import type { Listing } from "@/types/listing";
import Link from "next/link";

export default function PropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const id = String(params.id ?? "");
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  // Protect route: redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/login?redirect=/property/${id}`);
    }
  }, [authLoading, isAuthenticated, id, router]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    resolveListingById(id).then((result) => {
      if (!cancelled) {
        setListing(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {authLoading || loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : !isAuthenticated ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : !listing ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h1 className="text-xl font-semibold text-slate-900">Property not found</h1>
            <p className="mt-2 text-sm text-slate-500">This listing may have been removed.</p>
            <Link href="/buy" className="btn-primary mt-6 inline-flex">
              Browse listings
            </Link>
          </div>
        ) : (
          <PropertyDetailsView listing={listing} />
        )}
      </main>
    </div>
  );
}
