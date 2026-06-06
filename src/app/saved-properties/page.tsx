"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { useAuth } from "@/context/AuthProvider";
import { useListings } from "@/hooks/useListings";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import { resolveListingByIdSync } from "@/lib/get-listing";
import type { Listing } from "@/types/listing";

export default function SavedPropertiesPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { listings, loading: listingsLoading } = useListings();
  const { savedIds, loading: savedLoading, toggleSave, isSaved } = useSavedProperties();
  const [listingLikeCounts, setListingLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?redirect=/saved-properties");
    }
  }, [authLoading, isAuthenticated, router]);

  const savedListings = savedIds
    .map((id) => resolveListingByIdSync(id, listings))
    .filter((listing): listing is Listing => listing !== null);

  // Initialize like counts from listings
  useEffect(() => {
    const counts: Record<string, number> = {};
    for (const listing of savedListings) {
      counts[listing.id] = listing.like_count ?? 0;
    }
    setListingLikeCounts(counts);
  }, [savedListings]);

  const handleToggleSave = useCallback(
    async (listingId: string) => {
      const currentlySaved = isSaved(listingId);
      // Optimistically update like count
      setListingLikeCounts((prev) => ({
        ...prev,
        [listingId]: currentlySaved ? (prev[listingId] ?? 0) - 1 : (prev[listingId] ?? 0) + 1,
      }));
      // Execute the actual toggle
      await toggleSave(listingId);
    },
    [isSaved, toggleSave]
  );

  const loading = authLoading || listingsLoading || savedLoading;

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Saved properties</h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Properties you&apos;ve saved for later in the Tricity.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : savedListings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-600">You haven&apos;t saved any properties yet.</p>
            <Link href="/buy" className="btn-primary mt-6 inline-flex">
              Browse listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedListings.map(
              (listing) =>
                listing && (
                  <PropertyCard
                    key={listing.id}
                    listing={{
                      ...listing,
                      like_count: listingLikeCounts[listing.id] ?? listing.like_count ?? 0,
                    }}
                    href={`/property/${listing.id}`}
                    saved
                    showSaveButton
                    onToggleSave={() => handleToggleSave(listing.id)}
                  />
                )
            )}
          </div>
        )}
      </main>
    </div>
  );
}
