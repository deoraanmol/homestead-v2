"use client";

import { useMemo, useState } from "react";
import { Bath, BedDouble, MapPin, Search } from "lucide-react";
import { PropertyModal } from "@/components/PropertyModal";
import { formatPrice, listingImage } from "@/lib/utils";
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

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-700 to-emerald-600 px-6 py-14 text-white shadow-xl sm:px-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find your next home
          </h2>
          <p className="mt-3 text-emerald-100">
            Browse curated properties across Australia&apos;s most desirable locations.
          </p>

          <div className="mt-8 rounded-2xl bg-white p-4 text-left shadow-2xl ring-1 ring-white/20 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-end">
              <FilterField label="Location">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className={filterInput}
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="City, suburb, or region"
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
                  placeholder="300000"
                />
              </FilterField>
              <FilterField label="Max price">
                <input
                  type="number"
                  min={0}
                  className={filterInput}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="1500000"
                />
              </FilterField>
              <button
                type="button"
                className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Available properties</h3>
            <p className="mt-1 text-sm text-slate-500">
              {filtered.length} {filtered.length === 1 ? "home" : "homes"} match your filters
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600">No properties match your search.</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting location or price range.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} onView={() => setSelected(listing)} />
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
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listingImage(listing.image_url)}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-sm font-bold text-brand-700 shadow">
          {formatPrice(listing.price)}
        </div>
      </div>

      <div className="p-5">
        <h4 className="text-lg font-semibold text-slate-900">{listing.title}</h4>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {listing.location}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Tag icon={<BedDouble className="h-3.5 w-3.5" />} label={`${listing.bedrooms} beds`} />
          <Tag icon={<Bath className="h-3.5 w-3.5" />} label={`${listing.bathrooms} baths`} />
        </div>

        <button
          type="button"
          onClick={onView}
          className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          View Details
        </button>
      </div>
    </article>
  );
}

function Tag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      {icon}
      {label}
    </span>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const filterInput =
  "w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20";