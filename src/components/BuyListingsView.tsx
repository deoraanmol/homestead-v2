"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Home, Search } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { PropertyFilters } from "@/components/PropertyFilters";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import {
  filterListings,
  paginateListings,
  sortListingsByProximity,
  type ListingFilters,
} from "@/lib/listings-helpers";
import type { Listing } from "@/types/listing";

const PAGE_SIZE = 6;

type Props = {
  listings: Listing[];
  loading?: boolean;
};

export function BuyListingsView({ listings, loading }: Props) {
  const [filters, setFilters] = useState<ListingFilters>({
    locationQuery: "",
    minPrice: "",
    maxPrice: "",
  });
  const [page, setPage] = useState(1);
  const { coords, available: geoAvailable } = useGeolocation();
  const { savedIds, toggleSave, isSaved } = useSavedProperties();
  const [listingLikeCounts, setListingLikeCounts] = useState<Record<string, number>>({});

  // Initialize like counts from listings
  useEffect(() => {
    const counts: Record<string, number> = {};
    for (const listing of listings) {
      counts[listing.id] = listing.like_count ?? 0;
    }
    setListingLikeCounts(counts);
  }, [listings]);

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

  const hasActiveFilters =
    filters.locationQuery.trim() !== "" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "";

  const processed = useMemo(() => {
    const filtered = filterListings(listings, filters);
    return sortListingsByProximity(filtered, coords);
  }, [listings, filters, coords]);

  const visible = useMemo(
    () => paginateListings(processed, page, PAGE_SIZE),
    [processed, page]
  );

  const hasMore = visible.length < processed.length;

  const loadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading);

  function clearFilters() {
    setFilters({ locationQuery: "", minPrice: "", maxPrice: "" });
    setPage(1);
  }

  useEffect(() => {
    setPage(1);
  }, [filters.locationQuery, filters.minPrice, filters.maxPrice]);

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-700 to-emerald-600 px-5 py-12 text-white shadow-xl sm:px-10 sm:py-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200/90">
            Tricity · Chandigarh Region
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Find your next home
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-emerald-50/95 sm:text-lg">
            Browse curated properties across Chandigarh, Mohali, Panchkula, and the wider Tricity.
          </p>
          <PropertyFilters filters={filters} onChange={setFilters} variant="hero" />
        </div>
      </section>

      <section className="mt-12 lg:mt-14">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Found for you
            </h3>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              {loading
                ? "Loading listings…"
                : listings.length === 0
                  ? "Check back soon for new listings."
                  : `Showing ${processed.length} ${listings.length === 1 ? "property" : "properties"} that match your search context`}
            </p>
          </div>
          {hasActiveFilters && listings.length > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="self-start text-sm font-medium text-brand-700 underline-offset-2 hover:underline sm:self-auto"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyListingsState />
        ) : processed.length === 0 ? (
          <EmptyFilterState onClear={clearFilters} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  listing={{
                    ...listing,
                    like_count: listingLikeCounts[listing.id] ?? listing.like_count ?? 0,
                  }}
                  href={`/property/${listing.id}`}
                  saved={isSaved(listing.id)}
                  showSaveButton
                  onToggleSave={() => handleToggleSave(listing.id)}
                />
              ))}
            </div>
            {hasMore && (
              <div ref={sentinelRef} className="mt-8 flex justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

function EmptyListingsState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm sm:px-12 sm:py-20">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Home className="h-7 w-7" />
      </div>
      <h4 className="mt-5 text-xl font-semibold text-slate-900">No properties yet</h4>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
        We&apos;re preparing new listings for the Tricity. Please check back soon.
      </p>
    </div>
  );
}

function EmptyFilterState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm sm:px-12 sm:py-20">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Search className="h-7 w-7" />
      </div>
      <h4 className="mt-5 text-xl font-semibold text-slate-900">No matches found</h4>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
        Nothing matches your current location or price range. Try widening your search.
      </p>
      <button type="button" onClick={onClear} className="btn-primary mt-6">
        Clear all filters
      </button>
    </div>
  );
}
