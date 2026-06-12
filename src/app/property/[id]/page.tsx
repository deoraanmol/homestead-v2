"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PropertyDetailsView } from "@/components/PropertyDetailsView";
import { resolveListingById } from "@/lib/get-listing";
import { useAuth } from "@/context/AuthProvider";
import type { Listing } from "@/types/listing";
import Link from "next/link";

export default function PropertyPage() {
  const params = useParams();
  const { loading: authLoading } = useAuth(); // Removed unused variables
  const id = String(params.id ?? "");
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-slate-50/50">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Simplified Loader: Only wait for the listing data query payload */}
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
          </div>
        ) : !listing ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center max-w-md mx-auto shadow-sm mt-12">
            <h1 className="text-xl font-bold text-slate-900">Property not found</h1>
            <p className="mt-2 text-sm text-slate-500">This listing may have been moved or removed by the owner.</p>
            <Link href="/buy" className="btn-primary mt-6 inline-flex bg-emerald-700 hover:bg-emerald-800 font-semibold px-4 py-2 rounded-xl text-white text-sm transition">
              Browse listings
            </Link>
          </div>
        ) : (
          /* Render layout details freely for authenticated and guest users alike */
          <PropertyDetailsView listing={listing} />
        )}
        
      </main>
    </div>
  );
}