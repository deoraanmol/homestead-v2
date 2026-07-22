"use client";

import { Suspense } from "react";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { BuyListingsView } from "@/components/BuyListingsView";

export default function BuyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        </div>
      }
    >
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <BuyListingsView />
        </main>
        <AppFooter />
      </div>
    </Suspense>
  );
}
