"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bath,
  BedDouble,
  ChevronDown,
  Heart,
  MapPin,
  Phone,
  School,
  Stethoscope,
  Store,
  TrainFront,
} from "lucide-react";
import { MessageDealerModal } from "@/components/MessageDealerModal";
import { PropertyGallery } from "@/components/PropertyGallery";
import { StarRating } from "@/components/StarRating";
import { useAuth } from "@/context/AuthProvider";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import {
  getAuditorRating,
  getFullSpecifications,
  getNearbyAmenities,
  MOCK_DEALER_PHONE,
} from "@/data/mock-property-details";
import { cn, formatPrice } from "@/lib/utils";
import type { Listing } from "@/types/listing";

type Props = {
  listing: Listing;
};

export function PropertyDetailsView({ listing }: Props) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isSaved, toggleSave } = useSavedProperties();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [likeCount, setLikeCount] = useState(listing.like_count ?? 0);

  const saved = isSaved(listing.id);
  const auditorRating = getAuditorRating(listing.id);
  const amenities = getNearbyAmenities(listing);
  const fullSpecs = getFullSpecifications(listing);

  async function handleToggleSave() {
    setSaving(true);
    const currentlySaved = isSaved(listing.id);
    // Optimistically update like count
    setLikeCount((prev) => (currentlySaved ? prev - 1 : prev + 1));
    await toggleSave(listing.id);
    setSaving(false);
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <PropertyGallery imageUrl={listing.image_url} title={listing.title} />

        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-2xl font-bold tracking-tight text-brand-700 sm:text-3xl">
                {formatPrice(listing.price)}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{listing.title}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-slate-600">
                <MapPin className="h-4 w-4 shrink-0 text-brand-600" />
                {listing.location}
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleSave}
              disabled={saving}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ring-1 transition",
                saved
                  ? "bg-brand-600 text-white ring-brand-600"
                  : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
              )}
            >
              <Heart className={cn("h-4 w-4", saved && "fill-current")} />
              {saved ? "Saved" : "Save property"}
              {likeCount > 0 && (
                <span className="ml-1 text-xs font-semibold opacity-75">({likeCount})</span>
              )}
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <SpecCard icon={<BedDouble className="h-4 w-4 text-brand-600" />} label="Bedrooms" value={String(listing.bedrooms)} />
            <SpecCard icon={<Bath className="h-4 w-4 text-brand-600" />} label="Bathrooms" value={String(listing.bathrooms)} />
          </div>

          {listing.description.trim() && (
            <p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">
              {listing.description}
            </p>
          )}
        </div>

        <div className="grid gap-6 px-5 py-6 sm:px-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Auditor rating</h2>
              <div className="mt-3 flex items-center gap-3">
                <StarRating rating={auditorRating} showValue size="lg" />
                <span className="text-sm text-slate-500">Independent property audit (mock)</span>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <button
                type="button"
                onClick={() => setDetailsOpen((o) => !o)}
                className="flex w-full items-center justify-between bg-white px-5 py-4 text-left hover:bg-slate-50"
                aria-expanded={detailsOpen}
              >
                <span className="font-semibold text-slate-900">View full specifications</span>
                <ChevronDown className={cn("h-5 w-5 text-slate-400 transition", detailsOpen && "rotate-180")} />
              </button>
              <div className={cn("grid transition-[grid-template-rows] duration-200", detailsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <p className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {fullSpecs}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Nearby amenities</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {amenities.school && <AmenityRow icon={<School className="h-4 w-4" />} label="Nearest school" value={amenities.school} />}
                {amenities.hospital && <AmenityRow icon={<Stethoscope className="h-4 w-4" />} label="Nearest hospital" value={amenities.hospital} />}
                {amenities.market && <AmenityRow icon={<Store className="h-4 w-4" />} label="Nearest market" value={amenities.market} />}
                {amenities.transport && <AmenityRow icon={<TrainFront className="h-4 w-4" />} label="Public transport" value={amenities.transport} />}
              </ul>
            </section>

            <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Contact dealer</h2>
              <p className="mt-1 text-sm text-slate-500">Reach out about this listing (mock contact).</p>
              <div className="mt-4 space-y-3">
                <button type="button" onClick={() => setMessageOpen(true)} className="btn-primary w-full">
                  Message dealer
                </button>
                <a href={`tel:${MOCK_DEALER_PHONE.replace(/\s/g, "")}`} className="btn-secondary flex w-full gap-2">
                  <Phone className="h-4 w-4" />
                  Call {MOCK_DEALER_PHONE}
                </a>
              </div>
            </section>

            <Link href="/buy" className="block text-center text-sm font-medium text-brand-700 hover:underline">
              ← Back to listings
            </Link>
          </div>
        </div>
      </div>

      {messageOpen && (
        <MessageDealerModal recipientName="Property dealer" onClose={() => setMessageOpen(false)} />
      )}
    </>
  );
}

function SpecCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
      {icon}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function AmenityRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: { title: string; distance: string };
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2">
        <span className="text-brand-600">{icon}</span>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
          <span className="text-sm font-medium text-slate-900">{value.title}</span>
        </div>
      </span>
      <span className="whitespace-nowrap font-medium text-brand-600">{value.distance}</span>
    </li>
  );
}
