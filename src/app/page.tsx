"use client";

import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { MOCK_LISTINGS } from "@/data/mock-listings";
import { listingImage } from "@/lib/utils";

export default function LandingPage() {
  const backgroundListings = [...MOCK_LISTINGS, ...MOCK_LISTINGS].slice(0, 9);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100">
      {/* Reduced background blur grid for sharp, premium visual depth */}
      <div className="absolute inset-0 select-none pointer-events-none opacity-40 scale-100 blur-[3px]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-8 md:grid-cols-2 lg:grid-cols-3">
          {backgroundListings.map((listing, i) => (
            <div key={`${listing.id}-${i}`} className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
              <div className="aspect-[4/3]">
                <img
                  src={listingImage(listing.image_url)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Balanced semi-opaque whitish tint to counter overexposure */}
      <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[0.5px]" />

      {/* Centered Hero Card */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl border border-slate-200/80 sm:p-10">
          
          {/* Main Typography Stack */}
          <div>
            <h1 className="text-3xl font-black tracking-tight text-emerald-700 sm:text-4xl">
              Homestead
            </h1>
            <h2 className="mt-2 text-md font-bold tracking-tight text-slate-900 sm:text-lg">
              Find your perfect property
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              Explore premium residential, commercial plots.
            </p>
          </div>

          {/* High-Utility Value Badges (30% Neutral Slate layout) */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-y border-slate-100 py-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /> Verified Listings
            </span>
            <span className="h-3 w-px bg-slate-200" />
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-emerald-700" /> Direct Deals
            </span>
          </div>

          {/* Core Action Callouts (10% Rich Emerald Accent) */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/buy"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center py-3.5 rounded-xl shadow-lg shadow-emerald-700/10 flex items-center justify-center gap-1.5 transition-all outline-none"
            >
              Buy
            </Link>
            <Link
              href="/dealers"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-center py-3.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all outline-none group"
            >
              Sell <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}