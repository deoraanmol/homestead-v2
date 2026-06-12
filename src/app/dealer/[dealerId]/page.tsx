"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Award,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { MessageDealerModal } from "@/components/MessageDealerModal";
import { PropertyCard } from "@/components/PropertyCard";
import { StarRating } from "@/components/StarRating";
import {
  getDealerById,
  getDealerTestimonials,
} from "@/data/mock-dealers";
import { MOCK_LISTINGS } from "@/data/mock-listings";
import { AppFooter } from "@/components/AppFooter";

export default function DealerDetailPage() {
  const params = useParams();
  const dealerId = String(params.dealerId ?? "");
  const dealer = getDealerById(dealerId);
  const testimonials = getDealerTestimonials(dealerId);
  const [messageOpen, setMessageOpen] = useState(false);

  const listings = useMemo(() => {
    if (!dealer) return [];
    return MOCK_LISTINGS.filter((l) => dealer.listingIds.includes(l.id));
  }, [dealer]);

  if (!dealer) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h1 className="text-xl font-semibold text-slate-900">Dealer not found</h1>
            <Link href="/dealers" className="btn-primary mt-6 inline-flex">
              Back to dealers
            </Link>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="relative h-40 sm:h-52">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dealer.coverUrl} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          </div>

          <div className="relative px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dealer.photoUrl}
                  alt={dealer.name}
                  className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                />
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{dealer.name}</h1>
                  <StarRating rating={dealer.rating} showValue className="mt-1" />
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {dealer.area}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setMessageOpen(true)} className="btn-primary">
                  Message dealer
                </button>
                <a
                  href={`tel:${dealer.phone.replace(/\s/g, "")}`}
                  className="btn-secondary inline-flex gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call dealer
                </a>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Stat label="Experience" value={`${dealer.yearsExperience} years`} />
              <Stat label="Active listings" value={String(dealer.activeListings)} />
              <Stat label="Area served" value={dealer.area} />
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <section>
                  <h2 className="text-lg font-semibold text-slate-900">About</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {dealer.biography}
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-slate-900">Certifications</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {dealer.certifications.map((cert) => (
                      <li
                        key={cert}
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800 ring-1 ring-brand-100"
                      >
                        <Award className="h-3.5 w-3.5" />
                        {cert}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-slate-900">Active listings</h2>
                  <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {listings.map((listing) => (
                      <PropertyCard key={listing.id} listing={listing} href={`/property/${listing.id}`} />
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-slate-900">Testimonials</h2>
                  <div className="mt-4 space-y-4">
                    {testimonials.map((t) => (
                      <blockquote
                        key={t.id}
                        className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200"
                      >
                        <StarRating rating={t.rating} size="sm" />
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.text}</p>
                        <footer className="mt-2 text-xs font-medium text-slate-500">
                          {t.author} · {t.date}
                        </footer>
                      </blockquote>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                  <h2 className="font-semibold text-slate-900">Contact</h2>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-brand-600" />
                      {dealer.phone}
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-brand-600" />
                      {dealer.email}
                    </li>
                  </ul>
                </div>
                <Link href="/dealers" className="block text-sm font-medium text-brand-700 hover:underline">
                  ← All dealers
                </Link>
              </aside>
            </div>
          </div>
        </div>
      </main>

      {messageOpen && (
        <MessageDealerModal recipientName={dealer.name} onClose={() => setMessageOpen(false)} />
      )}
      <AppFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
