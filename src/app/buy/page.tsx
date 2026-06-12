"use client";

import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { BuyListingsView } from "@/components/BuyListingsView";
import { useListings } from "@/hooks/useListings";

export default function BuyPage() {
  const { listings, loading, statusMessage } = useListings();

  return (
    <div className="min-h-screen">
      <AppHeader statusMessage={statusMessage} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BuyListingsView listings={listings} loading={loading} />
      </main>
      <AppFooter />
    </div>
  );
}
