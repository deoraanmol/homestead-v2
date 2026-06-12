"use client";

import { useState, useEffect } from "react";
import { MapPin, X, ArrowRight, Building2, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchPopularLocalities } from "@/lib/supabase";
import { useLocationSync } from "@/hooks/useLocationSync";

type LocationSelectorProps = {
  value: string;
  onChange: (value: string) => void;
  isHero: boolean;
};

export function LocationSelector({ value, onChange, isHero }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Tricity");
  const [isLoading, setIsLoading] = useState(false);
  const [localities, setLocalities] = useState<string[]>([]);
  const [internalSearch, setInternalSearch] = useState("");
  const { setGlobalLocation } = useLocationSync();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup layer if the component unmounts unexpectedly
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen || selectedCity !== "Tricity") return;

    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchPopularLocalities(internalSearch);
        setLocalities(data);
      } catch (err) {
        console.error("Supabase locality parsing error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    const delayDebounce = setTimeout(() => {
      loadData();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [isOpen, selectedCity, internalSearch]);

  const cities = [
    { id: "Tricity", name: "Chandigarh Tricity", active: true },
    { id: "Delhi", name: "Delhi NCR", active: false },
    { id: "Mumbai", name: "Mumbai", active: false },
  ];

  const tricityHubs = [
    "Chandigarh",
    "Mohali",
    "Panchkula",
    "Zirakpur",
    "New Chandigarh"
  ];

  return (
    <>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={cn(
            "input-field pl-10 w-full text-left flex items-center justify-between border border-slate-200 rounded-lg text-sm select-none transition",
            !isHero ? "bg-white" : "bg-slate-50/50"
          )}
        >
          <span className={cn(value ? "text-slate-900" : "text-slate-400")}>
            {value || "Sector, Mohali, Panchkula…"}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 transition-all">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Select Location</h3>
                <p className="text-xs text-slate-500">Choose a city to explore available properties</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setInternalSearch("");
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 select-none">
              {cities.map((city) => {
                const isSelected = selectedCity === city.id;
                return (
                  <button
                    type="button"
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    className={cn(
                      "px-4 py-2 text-sm font-semibold rounded-full border transition-all whitespace-nowrap flex items-center gap-2 outline-none",
                      isSelected
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    <span>{city.name}</span>
                    {!city.active && (
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors",
                        isSelected ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
                      )}>
                        Soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 min-h-[260px]">
              {selectedCity === "Tricity" ? (
                <div>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 text-slate-900 placeholder:text-slate-400 transition"
                      placeholder="Type sector or locality name to filter..."
                      value={internalSearch}
                      onChange={(e) => setInternalSearch(e.target.value)}
                    />
                  </div>

                  {!internalSearch && (
                    <div className="mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Browse Entire Region
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tricityHubs.map((hub) => (
                          <button
                            type="button"
                            key={hub}
                            onClick={() => {
                              setGlobalLocation(hub, "Tricity");
                              onChange(hub);
                              setIsOpen(false);
                            }}
                            className="text-xs font-medium px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-800 border border-transparent hover:border-emerald-200 transition"
                          >
                            {hub}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    {internalSearch ? "Matching Localities" : "Popular Localities"}
                  </span>
                  
                  {isLoading ? (
                    <div className="flex min-h-[100px] items-center justify-center w-full">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-700" />
                    </div>
                  ) : localities.length === 0 ? (
                    <div className="text-center text-slate-400 py-6 text-xs">
                      No matching properties found for "{internalSearch}"
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                      {localities.map((locality) => (
                        <button
                          type="button"
                          key={locality}
                          onClick={() => {
                            // Extract the last word from string (handles "Sector 70 Mohali" and "Sector 17, Chandigarh")
                            const words = locality.trim().split(/[\s,]+/);
                            const parsedCity = words.length > 0 ? words[words.length - 1] : "Chandigarh";
                            
                            // Update state and layout visibility settings
                            setGlobalLocation(parsedCity, "Tricity");
                            onChange(locality);
                            setIsOpen(false);
                            setInternalSearch("");
                          }}
                          className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 text-left text-sm font-medium text-slate-700 hover:border-emerald-600 hover:bg-emerald-50/20 hover:text-emerald-800 transition shadow-sm"
                        >
                          <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="truncate">{locality}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                    <MapPin className="h-6 w-6 text-emerald-700" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Coming Soon to {cities.find(c => c.id === selectedCity)?.name}!</h4>
                  <p className="mt-2 text-xs text-slate-500 max-w-xs leading-relaxed">
                    Homestead currently operates exclusively in the <span className="font-semibold text-emerald-800">Chandigarh Tricity</span> region to guarantee premium localized service delivery.
                  </p>
                  
                  <div className="mt-5 w-full max-w-xs flex gap-2">
                    <input
                      type="email"
                      placeholder="Email for early access"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 bg-white text-slate-900 placeholder:text-slate-400"
                    />
                    <button 
                      type="button"
                      className="bg-emerald-700 text-white px-3 rounded-lg text-xs font-semibold hover:bg-emerald-800 transition flex items-center gap-1 shrink-0 shadow-sm"
                    >
                      Notify Me <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}