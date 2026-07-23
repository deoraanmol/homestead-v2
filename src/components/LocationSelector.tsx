"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Loader2,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocationSync } from "@/hooks/useLocationSync";
import { useLocationAutocomplete } from "@/hooks/useLocationAutocomplete";
import { setCoordsForLocation } from "@/lib/geolocation";
import type { LocationSuggestion } from "@/lib/nominatim";

type LocationSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  isHero: boolean;
};

export function LocationSelector({ value, onChange, isHero }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Tricity");
  const { setGlobalLocation } = useLocationSync();
  const { suggestions, isLoading, query, setQuery, selectSuggestion, clearSearch } =
    useLocationAutocomplete();

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";

      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const handleSelectLocation = (suggestion: LocationSuggestion) => {
    (document.activeElement as HTMLElement | null)?.blur();
    setIsOpen(false);
    selectSuggestion(suggestion);
    setCoordsForLocation(suggestion.displayName, {
      lat: suggestion.latitude,
      lng: suggestion.longitude,
    });
    onChange(suggestion.displayName);
    setGlobalLocation(suggestion.displayName, "Tricity");
    setSelectedCity("Tricity");
  };

  const handleClear = () => {
    setIsOpen(false);
    clearSearch();
  };

  const handleQuickSelect = (location: string) => {
    onChange(location);
    setGlobalLocation(location, "Tricity");
    clearSearch();
    setIsOpen(false);
    setSelectedCity("Tricity");
  };

  const cities = [
    { id: "Tricity", name: "Chandigarh Tricity", badge: null },
    { id: "Delhi", name: "Delhi NCR", badge: "Soon" },
    { id: "Mumbai", name: "Mumbai", badge: "Soon" },
  ];

  const tricityHubs = [
    "Chandigarh",
    "Mohali",
    "Panchkula",
    "Zirakpur",
    "New Chandigarh",
  ];

  const emptyStateMessage = useMemo(() => {
    if (!query.trim()) return null;
    return query.toLowerCase().includes("delhi") || query.toLowerCase().includes("mumbai")
      ? "Outside Chandigarh Tricity is not supported yet."
      : "No matching Tricity location found yet.";
  }, [query]);

  return (
    <>
    <div className="relative w-full min-w-0 isolation-auto">
      <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title={value || undefined}
        className={cn(
          "input-field flex w-full min-w-0 items-center overflow-hidden rounded-lg border border-slate-200 pl-10 pr-3 text-left text-sm transition select-none table-layout-fixed",
          !isHero ? "bg-white" : "bg-slate-50/50"
        )}
      >
        <span
          className={cn(
            "inline-block w-full min-w-0 truncate",
            value ? "text-slate-900" : "text-slate-400"
          )}
        >
          {value || "Sector, Mohali, Panchkula…"}
        </span>
      </button>
    </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-slate-900/55 backdrop-blur-sm"
          onClick={handleClear}
        >
          <div
            className="flex h-full items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-[500px] rounded-[22px] bg-white shadow-2xl p-1">
              <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900 sm:text-[16px]">
                      Select Location
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Choose a city to explore available properties
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close location selector"
                    onClick={handleClear}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      handleClear();
                    }}
                    className="relative z-[9999] flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-500 transition active:scale-95 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-5 min-h-[250px]">
                  <div className="mb-5 flex flex-wrap gap-2">
                    {cities.map((city) => {
                      const active = city.id === selectedCity;
                      return (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => {
                            setSelectedCity(city.id);
                            clearSearch();
                          }}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                            active
                              ? "border-emerald-700 bg-emerald-700 text-white"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                          )}
                        >
                          <span>{city.name}</span>
                          {city.badge && (
                            <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                              {city.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedCity === "Tricity" ? (
                    <div>
                      <div className="relative mb-5">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
                          placeholder="Type sector or locality name to filter..."
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </div>

                      {isLoading && (
                        <div className="flex min-h-[120px] w-full items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-emerald-700" />
                        </div>
                      )}

                      {!isLoading && query.length === 0 && (
                        <div>
                          <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-400">
                            Browse Entire Region
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {tricityHubs.map((hub) => (
                              <button
                                type="button"
                                key={hub}
                                onClick={() => handleQuickSelect(hub)}
                                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                              >
                                {hub}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {!isLoading && suggestions.length > 0 && (
                        <div>
                          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                            Suggestions
                          </span>
                          <div className="max-h-64 space-y-2 overflow-y-auto">
                            {suggestions.map((suggestion) => (
                              <button
                                type="button"
                                key={suggestion.placeId}
                                onPointerUp={() => handleSelectLocation(suggestion)}
                                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left text-sm font-medium text-slate-700 transition hover:border-emerald-600 hover:bg-emerald-50/30 hover:text-emerald-800"
                              >
                                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="truncate font-semibold">
                                    {suggestion.displayName.split(",")[0]}
                                  </div>
                                  <div className="text-xs text-slate-500 truncate">
                                    {suggestion.displayName.split(",").slice(1).join(",")}
                                  </div>
                                </div>
                                <span
                                  className={cn(
                                    "text-xs px-2 py-1 rounded whitespace-nowrap",
                                    suggestion.type === "sector"
                                      ? "bg-blue-50 text-blue-700"
                                      : suggestion.type === "locality"
                                      ? "bg-purple-50 text-purple-700"
                                      : "bg-amber-50 text-amber-700"
                                  )}
                                >
                                  {suggestion.type}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {!isLoading && query.length > 0 && suggestions.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-8 text-center">
                          <MapPin className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                          <p className="text-sm font-semibold text-slate-700">Location not supported yet</p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {emptyStateMessage}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                        <MapPin className="h-6 w-6 text-emerald-700" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {cities.find((c) => c.id === selectedCity)?.name} is not supported yet
                      </h4>
                      <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
                        Homestead currently operates exclusively in the{" "}
                        <span className="font-semibold text-emerald-800">Chandigarh Tricity</span>{" "}
                        region.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}