"use client";

import { Suspense, useMemo } from "react";
import { AppHeader } from "@/components/AppHeader";
import { DealerCard } from "@/components/DealerCard";
import { MOCK_DEALERS } from "@/data/mock-dealers";
import { useGeolocation } from "@/hooks/useGeolocation";
import { distanceKm } from "@/lib/geolocation";
import { AppFooter } from "@/components/AppFooter";

export default function DealersPage() {
  const { coords, available } = useGeolocation();

  const dealers = useMemo(() => {
    if (!coords) return MOCK_DEALERS;
    return [...MOCK_DEALERS].sort((a, b) => {
      const distA = distanceKm(coords, { lat: a.lat, lng: a.lng });
      const distB = distanceKm(coords, { lat: b.lat, lng: b.lng });
      return distA - distB;
    });
  }, [coords]);

  return (
     <Suspense fallback={
              <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
              </div>
            }>
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Sell with Homestead
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Find a dealer in the Tricity
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              Connect with experienced property dealers across Chandigarh, Mohali, and
              Panchkula.{available ? " Sorted by proximity to you." : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dealers.map((dealer) => (
              <DealerCard key={dealer.id} dealer={dealer} />
            ))}
          </div>
        </main>
        <AppFooter />
      </div>
    </Suspense>
  );
}
