"use client";

import { useCallback, useEffect, useState } from "react";
import { Home, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton";
import { PropertyFilters } from "@/components/PropertyFilters";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import type { ListingFilters } from "@/lib/listings-helpers";
import { LISTING_CONFIG } from "@/lib/config";
import type { Listing } from "@/types/listing";

type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

const EMPTY_PAGINATION: PaginationState = {
  page: 1,
  pageSize: LISTING_CONFIG.PAGE_SIZE,
  total: 0,
  totalPages: 0,
  hasMore: false,
};

export function BuyListingsView() {
  const [filters, setFilters] = useState<ListingFilters>({
    locationQuery: "",
    minPrice: "",
    maxPrice: "",
    propertyTypeId: "",
  });
  const [apiListings, setApiListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<PaginationState>(EMPTY_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { coords, loading: geoLoading, available: hasUserLocation } = useGeolocation();
  const { toggleSave, isSaved } = useSavedProperties();
  const [listingLikeCounts, setListingLikeCounts] = useState<Record<string, number>>({});
  const [sortedByProximity, setSortedByProximity] = useState(false);

  const hasActiveFilters =
    filters.locationQuery.trim() !== "" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.propertyTypeId !== "";

  const buildParams = useCallback(
    (page: number) => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: LISTING_CONFIG.PAGE_SIZE.toString(),
      });

      if (filters.locationQuery) {
        params.append("location", filters.locationQuery);
      }
      if (filters.minPrice) {
        params.append("minPrice", filters.minPrice);
      }
      if (filters.maxPrice) {
        params.append("maxPrice", filters.maxPrice);
      }
      if (filters.propertyTypeId) {
        params.append("propertyTypeId", filters.propertyTypeId);
      }

      // Initial browse only: use shared coordinates when the user allows location.
      if (!hasActiveFilters && coords) {
        params.append("lat", coords.lat.toString());
        params.append("lng", coords.lng.toString());
      }

      return params;
    },
    [filters, hasActiveFilters, coords]
  );

  const fetchPage = useCallback(
    async (page: number, options?: { replace?: boolean }) => {
      const replace = options?.replace ?? page === 1;
      if (replace) {
        setIsLoading(true);
      } else {
        setIsPageLoading(true);
      }

      try {
        const response = await fetch(`/api/listings?${buildParams(page)}`);
        if (!response.ok) throw new Error("Failed to fetch listings");

        const data = await response.json();
        setApiListings(data.data || []);
        setPagination(data.pagination || EMPTY_PAGINATION);
        setSortedByProximity(data.meta?.sortedBy === "proximity");
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        setApiListings([]);
        setPagination(EMPTY_PAGINATION);
        setSortedByProximity(false);
      } finally {
        setIsLoading(false);
        setIsPageLoading(false);
      }
    },
    [buildParams]
  );

  // Wait for geolocation attempt to settle on initial browse so proximity sort is consistent.
  useEffect(() => {
    if (!hasActiveFilters && geoLoading) return;
    fetchPage(1, { replace: true });
  }, [filters, hasActiveFilters, geoLoading, coords?.lat, coords?.lng, fetchPage]);

  useEffect(() => {
    const counts: Record<string, number> = {};
    for (const listing of apiListings) {
      counts[listing.id] = listing.like_count ?? 0;
    }
    setListingLikeCounts(counts);
  }, [apiListings]);

  const handleToggleSave = useCallback(
    async (listingId: string) => {
      const currentlySaved = isSaved(listingId);
      setListingLikeCounts((prev) => ({
        ...prev,
        [listingId]: currentlySaved
          ? Math.max(0, (prev[listingId] ?? 0) - 1)
          : (prev[listingId] ?? 0) + 1,
      }));
      await toggleSave(listingId);
    },
    [isSaved, toggleSave]
  );

  const loadMore = useCallback(async () => {
    if (isLoading || isPageLoading || !pagination.hasMore) return;
    await fetchPage(pagination.page + 1);
  }, [fetchPage, isLoading, isPageLoading, pagination.hasMore, pagination.page]);

  const loadPrevious = useCallback(async () => {
    if (isLoading || isPageLoading || pagination.page <= 1) return;
    await fetchPage(pagination.page - 1);
  }, [fetchPage, isLoading, isPageLoading, pagination.page]);

  function clearFilters() {
    setFilters({ locationQuery: "", minPrice: "", maxPrice: "", propertyTypeId: "" });
  }

  const displayLoading = isLoading || (!hasActiveFilters && geoLoading);
  const displayIsEmpty = !displayLoading && pagination.total === 0 && !hasActiveFilters;
  const displayNoMatches = !displayLoading && hasActiveFilters && pagination.total === 0;
  const totalResultsText = `${pagination.total} ${
    pagination.total === 1 ? "property" : "properties"
  }`;

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-700 to-emerald-600 px-5 pt-12 pb-40 text-white shadow-xl sm:px-10 sm:pt-16 sm:pb-52">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Tricity · Chandigarh Region
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight text-slate-900">
            Find your next home
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Browse curated properties across Chandigarh, Mohali, Panchkula, and the wider Tricity.
          </p>
          <PropertyFilters filters={filters} onChange={setFilters} variant="hero" />
        </div>
      </section>

      <section className="mt-12 lg:mt-14">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {hasActiveFilters ? "Search results" : "Found for you"}
            </h3>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              {displayLoading
                ? "Loading listings…"
                : displayIsEmpty
                  ? "Check back soon for new listings."
                  : displayNoMatches
                    ? "No results match your search."
                    : hasActiveFilters
                      ? `${totalResultsText} matching your search`
                      : sortedByProximity || hasUserLocation
                        ? `${totalResultsText} closest to your location`
                        : `${totalResultsText} available`}
            </p>
          </div>
          {hasActiveFilters && apiListings.length > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="self-start text-sm font-medium text-brand-700 underline-offset-2 hover:underline sm:self-auto"
            >
              Clear filters
            </button>
          )}
        </div>

        {displayLoading && apiListings.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : displayIsEmpty ? (
          <EmptyListingsState />
        ) : displayNoMatches ? (
          <EmptyFilterState onClear={clearFilters} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {apiListings.map((listing) => (
                <PropertyCard
                  key={listing.id}
                  listing={{
                    ...listing,
                    like_count:
                      listingLikeCounts[listing.id] ?? listing.like_count ?? 0,
                  }}
                  href={`/property/${listing.id}`}
                  saved={isSaved(listing.id)}
                  showSaveButton
                  onToggleSave={() => handleToggleSave(listing.id)}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={loadPrevious}
                  disabled={pagination.page <= 1 || isPageLoading || isLoading}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-semibold">{pagination.page}</span>
                  <span>/</span>
                  <span>{pagination.totalPages}</span>
                </div>

                <button
                  type="button"
                  onClick={loadMore}
                  disabled={!pagination.hasMore || isPageLoading || isLoading}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
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
