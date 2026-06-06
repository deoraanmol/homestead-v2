"use client";

import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListingFilters } from "@/lib/listings-helpers";

type Props = {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  variant?: "hero" | "inline";
};

export function PropertyFilters({ filters, onChange, variant = "hero" }: Props) {
  const isHero = variant === "hero";

  function update<K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  const fields = (
    <div
      className={cn(
        "grid gap-4",
        isHero
          ? "sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end"
          : "sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]"
      )}
    >
      <FilterField label="Location">
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className={cn("input-field pl-10", !isHero && "bg-white")}
            value={filters.locationQuery}
            onChange={(e) => update("locationQuery", e.target.value)}
            placeholder="Sector, Mohali, Panchkula…"
          />
        </div>
      </FilterField>
      <FilterField label="Min price">
        <input
          type="number"
          min={0}
          className={cn("input-field", !isHero && "bg-white")}
          value={filters.minPrice}
          onChange={(e) => update("minPrice", e.target.value)}
          placeholder="50,00,000"
        />
      </FilterField>
      <FilterField label="Max price">
        <input
          type="number"
          min={0}
          className={cn("input-field", !isHero && "bg-white")}
          value={filters.maxPrice}
          onChange={(e) => update("maxPrice", e.target.value)}
          placeholder="2,00,00,000"
        />
      </FilterField>
      {isHero && (
        <button
          type="button"
          className="btn-primary h-[42px] w-full gap-2 sm:w-auto lg:min-w-[120px]"
          aria-label="Apply search filters"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      )}
    </div>
  );

  if (isHero) {
    return (
      <div className="mt-8 rounded-2xl bg-white p-4 text-left shadow-2xl ring-1 ring-white/25 sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-slate-700">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-semibold">Search filters</span>
        </div>
        {fields}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:p-5">
      <div className="mb-4 flex items-center gap-2 text-slate-700">
        <SlidersHorizontal className="h-4 w-4 text-brand-600" />
        <span className="text-sm font-semibold">Refine search</span>
      </div>
      {fields}
    </div>
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
