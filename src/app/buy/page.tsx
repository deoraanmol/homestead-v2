"use client";

import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { BuyListingsView } from "@/components/BuyListingsView";
import { useListings } from "@/hooks/useListings";
import { Suspense } from "react";

export default function BuyPage() {
  const { listings, loading, statusMessage } = useListings();

  return (
    <Suspense fallback={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        }>
      <div className="min-h-screen">
        <AppHeader statusMessage={statusMessage} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <BuyListingsView listings={listings} loading={loading} />
        </main>
        <AppFooter />
      </div>
    </Suspense>
  );
}
