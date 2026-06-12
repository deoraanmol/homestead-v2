"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
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

  // ✅ FIX: Memoize array reference calculation to stop infinite render loops
  const savedListings = useMemo(() => {
    return savedIds
      .map((id) => resolveListingByIdSync(id, listings))
      .filter((listing): listing is Listing => listing !== null);
  }, [savedIds, listings]);

  // Initialize like counts cleanly once memoized listings switch addresses
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
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex min-h-[40vh] items-center justify-center">
            {/* Swapped border-brand-600 to new 10% Emerald design loop */}
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          {/* Typography fixed to 30% structural neutral shades */}
          <h1 className="text-2xl font-bold text-neutral-dark sm:text-3xl">Saved properties</h1>
          <p className="mt-2 text-sm text-neutral sm:text-base">
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
          /* Empty state matching neutral-light structural styles */
          <div className="rounded-2xl border border-dashed border-neutral/20 bg-neutral-light/30 p-12 text-center">
            <p className="text-neutral">You haven&apos;t saved any properties yet.</p>
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