"use client";

import Link from "next/link";
import { MOCK_LISTINGS } from "@/data/mock-listings";
import { listingImage } from "@/lib/utils";

export default function LandingPage() {
  const backgroundListings = [...MOCK_LISTINGS, ...MOCK_LISTINGS].slice(0, 9);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 scale-105 blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-8 opacity-60 md:grid-cols-2 lg:grid-cols-3">
          {backgroundListings.map((listing, i) => (
            <div key={`${listing.id}-${i}`} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
              <div className="aspect-[4/3] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listingImage(listing.image_url)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" />

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 text-center shadow-2xl ring-1 ring-white/60 backdrop-blur-md sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            Homestead · Tricity
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Want to
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Find your home in Chandigarh, Mohali &amp; Panchkula
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/buy"
              className="btn-primary py-3.5 text-base shadow-lg shadow-brand-600/20"
            >
              Buy
            </Link>
            <Link
              href="/dealers"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700"
            >
              Sell
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
