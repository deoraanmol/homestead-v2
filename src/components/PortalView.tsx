"use client";

import { useMemo, useState } from "react";
import {
  Bath,
  BedDouble,
  Home,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { PropertyModal } from "@/components/PropertyModal";
import { cn, formatPrice, listingImage } from "@/lib/utils";
import type { Listing } from "@/types/listing";

type Props = {
  listings: Listing[];
};

export function PortalView({ listings }: Props) {
  const [locationQuery, setLocationQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selected, setSelected] = useState<Listing | null>(null);

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Infinity;
    const q = locationQuery.trim().toLowerCase();

    return listings.filter((l) => {
      const matchesLocation = !q || l.location.toLowerCase().includes(q);
      const matchesPrice = l.price >= min && l.price <= max;
      return matchesLocation && matchesPrice;
    });
  }, [listings, locationQuery, minPrice, maxPrice]);

  const hasActiveFilters =
    locationQuery.trim() !== "" || minPrice !== "" || maxPrice !== "";

  function clearFilters() {
    setLocationQuery("");
    setMinPrice("");
    setMaxPrice("");
  }

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
            Browse curated homes across Chandigarh, Mohali, Panchkula, and the
            wider Tricity.
          </p>

          <div className="mt-8 rounded-2xl bg-white p-4 text-left shadow-2xl ring-1 ring-white/25 sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-slate-700">
              <SlidersHorizontal className="h-4 w-4 text-brand-600" />
              <span className="text-sm font-semibold">Search filters</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end">
              <FilterField label="Location">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className={cn(filterInput, "pl-10")}
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Sector, Mohali, Panchkula…"
                  />
                </div>
              </FilterField>
              <FilterField label="Min price">
                <input
                  type="number"
                  min={0}
                  className={filterInput}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="50,00,000"
                />
              </FilterField>
              <FilterField label="Max price">
                <input
                  type="number"
                  min={0}
                  className={filterInput}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="2,00,00,000"
                />
              </FilterField>
              <button
                type="button"
                className="btn-primary h-[42px] w-full gap-2 sm:w-auto lg:min-w-[120px]"
                aria-label="Apply search filters"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 lg:mt-14">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Available properties
            </h3>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              {listings.length === 0
                ? "Check back soon for new listings."
                : `${filtered.length} of ${listings.length} ${
                    listings.length === 1 ? "property" : "properties"
                  }${hasActiveFilters ? " match your filters" : ""}`}
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

        {listings.length === 0 ? (
          <EmptyListingsState />
        ) : filtered.length === 0 ? (
          <EmptyFilterState onClear={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((listing) => (
              <PropertyCard
                key={listing.id}
                listing={listing}
                onView={() => setSelected(listing)}
              />
            ))}
          </div>
        )}
      </section>

      {selected && (
        <PropertyModal listing={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function PropertyCard({
  listing,
  onView,
}: {
  listing: Listing;
  onView: () => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-slate-300">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listingImage(listing.image_url)}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 text-sm font-bold text-brand-700 shadow-sm backdrop-blur-sm">
          {formatPrice(listing.price)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h4 className="line-clamp-2 text-lg font-semibold leading-snug text-slate-900">
          {listing.title}
        </h4>
        <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-slate-500">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="line-clamp-2">{listing.location}</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Tag
            icon={<BedDouble className="h-3.5 w-3.5" />}
            label={`${listing.bedrooms} beds`}
          />
          <Tag
            icon={<Bath className="h-3.5 w-3.5" />}
            label={`${listing.bathrooms} baths`}
          />
        </div>

        <button type="button" onClick={onView} className="btn-secondary mt-5 w-full">
          View Details
        </button>
      </div>
    </article>
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
        We&apos;re preparing new listings for you. Please check back soon, or
        contact us if you&apos;re looking for something specific.
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
        Nothing matches your current location or price range. Try widening your
        search or clearing filters to see more homes.
      </p>
      <button type="button" onClick={onClear} className="btn-primary mt-6">
        Clear all filters
      </button>
    </div>
  );
}

function Tag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
      {icon}
      {label}
    </span>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const filterInput = "input-field";
