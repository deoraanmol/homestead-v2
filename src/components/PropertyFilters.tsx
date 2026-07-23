"use client";

import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListingFilters } from "@/lib/listings-helpers";
import { PROPERTY_TYPE_OPTIONS } from "@/data/property-types";
import { LocationSelector } from "./LocationSelector";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

type Props = {
  filters: ListingFilters;
  onChange: (filters: ListingFilters) => void;
  variant?: "hero" | "inline";
};

export function PropertyFilters({ filters, onChange, variant = "hero" }: Props) {
  const MIN_PRICE_OPTIONS = [
    { value: "2500000", label: "25 Lac" },
    { value: "5000000", label: "50 Lac" },
    { value: "7500000", label: "75 Lac" },
    { value: "10000000", label: "1 Cr" },
    { value: "15000000", label: "1.5 Cr" },
    { value: "20000000", label: "2 Cr" },
    { value: "30000000", label: "3 Cr" },
    { value: "50000000", label: "5 Cr" },
  ];
  
  const MAX_PRICE_OPTIONS = [
    { value: "5000000", label: "50 Lac" },
    { value: "7500000", label: "75 Lac" },
    { value: "10000000", label: "1 Cr" },
    { value: "15000000", label: "1.5 Cr" },
    { value: "20000000", label: "2 Cr" },
    { value: "30000000", label: "3 Cr" },
    { value: "50000000", label: "5 Cr" },
    { value: "100000000", label: "10 Cr" },
  ];
  
  const formatIndianCommas = (str: string): string => {
    const digits = str.replace(/\D/g, "");
    if (!digits) return "";
    return new Intl.NumberFormat("en-IN").format(parseInt(digits, 10));
  };
  
  const getLakhCroreLabel = (str: string): string => {
    const digits = str.replace(/\D/g, "");
    if (!digits) return "";
    const value = parseInt(digits, 10);
    if (value >= 10000000) return `₹ ${(value / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
    if (value >= 10000) return `₹ ${(value / 100000).toFixed(2).replace(/\.00$/, "")} Lac`;
    return `₹ ${new Intl.NumberFormat("en-IN").format(value)}`;
  };
  const isHero = variant === "hero";
  const [activeDropdown, setActiveDropdown] = useState<"min" | "max" | null>(null);
  const [propertyTypeDropdownOpen, setPropertyTypeDropdownOpen] = useState(false);
const propertyTypeRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const maxRef = useRef<HTMLDivElement>(null);
  const [selectedMinPrice, setSelectedMinPrice] = useState<string | null>(null);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const listingCity = searchParams.get("listingCity");
    if (listingCity) {
      onChange({ ...filters, locationQuery: listingCity });
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown === "min" && minRef.current && !minRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (activeDropdown === "max" && maxRef.current && !maxRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  function update<K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  const fields = (
    <div
      className={cn(
        "grid gap-4 w-full min-w-0 overflow-visible",
        isHero
          ? "sm:grid-cols-2 lg:grid-cols-[1.4fr_1.1fr_1fr_1fr_auto] lg:items-end"
          : "sm:grid-cols-2 lg:grid-cols-[1.4fr_1.1fr_1fr_1fr]"
      )}
    >
      {/* Patched Location Field Triggering Dialog Modal */}
      <FilterField label="Location" className="min-w-0 w-full overflow-hidden">
        <LocationSelector 
          value={filters.locationQuery} 
          onChange={(val) => update("locationQuery", val)} 
          isHero={isHero}
        />
      </FilterField>

      <FilterField label="Property type" className="min-w-0 w-full">
        <div ref={propertyTypeRef} className="relative w-full z-50">
          <button
            type="button"
            onClick={() => setPropertyTypeDropdownOpen(!propertyTypeDropdownOpen)}
            className={cn(
              "input-field flex w-full min-w-0 items-center overflow-hidden rounded-lg border border-slate-200 pl-3 pr-10 py-2 text-left text-sm transition select-none relative z-10",
              !isHero ? "bg-white" : "bg-slate-50/50"
            )}
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate",
                filters.propertyTypeId ? "text-slate-900" : "text-slate-400"
              )}
            >
              {/* Find and map the active option string label directly to display text */}
              {PROPERTY_TYPE_OPTIONS.find((opt) => opt.id === filters.propertyTypeId)?.label || "All types"}
            </span>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </button>

          {/* Custom Dropdown Options Panel - Exactly identical to your Min Price layout */}
          {propertyTypeDropdownOpen && (
            <div className="absolute left-0 top-[calc(100%+4px)] w-full max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl z-30 py-1">
              {/* All types reset button trigger */}
              <button
                type="button"
                className={cn(
                  "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50",
                  !filters.propertyTypeId ? "bg-slate-50 font-semibold text-emerald-700" : "text-slate-700"
                )}
                onClick={() => {
                  update("propertyTypeId", "");
                  setPropertyTypeDropdownOpen(false);
                }}
              >
                All types
              </button>
              
              {/* Custom dataset loop array mapping */}
              {PROPERTY_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-slate-50",
                    filters.propertyTypeId === opt.id ? "bg-slate-50 font-semibold text-emerald-700" : "text-slate-700"
                  )}
                  onClick={() => {
                    update("propertyTypeId", opt.id);
                    setPropertyTypeDropdownOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </FilterField>
      
      <FilterField label="Min price" className="min-w-0 w-full">
      <div ref={minRef} className="relative w-full z-10">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none select-none">
          ₹
        </span>
        <input
          type="text"
          className={cn(
            "input-field pl-7 pr-3 w-full transition-all", 
            !isHero && "bg-white",
            filters.minPrice && "pb-4 pt-1"
          )}
          value={filters.minPrice ? formatIndianCommas(filters.minPrice) : ""}
          onFocus={() => setActiveDropdown("min")}
          onChange={(e) => {
            const rawDigits = e.target.value.replace(/\D/g, "");
            update("minPrice", rawDigits);
          }}
          placeholder="50,00,000"
        />
        {filters.minPrice && (
          <span className="absolute bottom-1 left-7 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pointer-events-none transition-all z-10">
            {getLakhCroreLabel(filters.minPrice)}
          </span>
        )}

        {/* Dynamic Dropdown Options Panel */}
        {activeDropdown === "min" && (
          <div className="absolute left-0 top-[calc(100%+4px)] w-full max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl z-30 py-1">
            {MIN_PRICE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => {
                  update("minPrice", opt.value);
                  setActiveDropdown(null);
                }}
              >
                ₹ {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      </FilterField>

      {/* Improved Max Price Field with Dropdown Overlay */}
      <FilterField label="Max price" className="min-w-0 w-full">
        <div ref={maxRef} className="relative w-full z-5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none select-none">
            ₹
          </span>
          <input
            type="text"
            className={cn(
              "input-field pl-6 pr-3 w-full transition-all", 
              !isHero && "bg-white",
              filters.maxPrice && "pb-4 pt-1"
            )}
            value={filters.maxPrice ? formatIndianCommas(filters.maxPrice) : ""}
            onFocus={() => setActiveDropdown("max")}
            onChange={(e) => {
              const rawDigits = e.target.value.replace(/\D/g, "");
              update("maxPrice", rawDigits);
            }}
            placeholder="2,00,00,000"
          />
          {filters.maxPrice && (
            <span className="absolute bottom-1 left-7 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 pointer-events-none transition-all z-10">
              {getLakhCroreLabel(filters.maxPrice)}
            </span>
          )}

          {/* Dynamic Dropdown Options Panel */}
          {activeDropdown === "max" && (
            <div className="absolute left-0 top-[calc(100%+4px)] w-full max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl z-30 py-1">
              {MAX_PRICE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    update("maxPrice", opt.value);
                    setActiveDropdown(null);
                  }}
                >
                  ₹ {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
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

function FilterField({ 
  label, 
  children, 
  className 
}: { 
  label: string; 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn("block min-w-0 w-full", className)}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </div>
  );
}