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
  Image as ImageIcon, 
  Map as MapIcon
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
import { cn, formatPropertyPrice } from "@/lib/utils";
import type { Listing } from "@/types/listing";

type Props = {
  listing: Listing;
};

// Mock coordinate and summary logic (or pull from listing object extensions)
const FIELD_BOY_LAT = 30.7333;
const FIELD_BOY_LNG = 76.7794;

export function PropertyDetailsView({ listing }: Props) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isSaved, toggleSave } = useSavedProperties();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [likeCount, setLikeCount] = useState(listing.like_count ?? 0);
  const [mediaMode, setMediaMode] = useState<"photos" | "satellite">("photos");
  const [isDescExpanded, setIsDescExpanded] = useState(false);

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
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] border-b border-slate-200 bg-slate-900 min-h-[420px]">
          {/* --- LEFT CONTAINER (70%): Media Viewer --- */}
          <div className="relative w-full h-[320px] lg:h-full bg-slate-950 overflow-hidden flex flex-col justify-between">
            <div className="w-full h-full relative">
              {mediaMode === "photos" ? (
                <PropertyGallery imageUrl={listing.image_url} title={listing.title} />
              ) : (
                <div className="w-full h-full bg-slate-800 relative">
                  <iframe
                      title="Google Top View Satellite Map"
                      className="w-full h-full border-none opacity-90"
                      loading="lazy"
                      allowFullScreen
                      src="https://google.com"
                    />
                  <div className="absolute top-3 left-3 bg-slate-900/90 text-xs px-2 py-1 rounded text-emerald-400 font-mono tracking-wide z-10">
                    Lat: {FIELD_BOY_LAT} | Lng: {FIELD_BOY_LNG}
                  </div>
                </div>
              )}
            </div>
            <div className="absolute bottom-4 left-4 flex gap-2 z-20">
              <button
                type="button"
                onClick={() => setMediaMode("photos")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur transition-all",
                  mediaMode === "photos" 
                    ? "bg-white text-slate-900 shadow-md scale-105" 
                    : "bg-slate-900/80 text-slate-300 hover:bg-slate-900"
                )}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Photos
              </button>
              <button
                type="button"
                onClick={() => setMediaMode("satellite")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur transition-all",
                  mediaMode === "satellite" 
                    ? "bg-white text-slate-900 shadow-md scale-105" 
                    : "bg-slate-900/80 text-slate-300 hover:bg-slate-900"
                )}
              >
                <MapIcon className="h-3.5 w-3.5" />
                Google Top View
              </button>
              <button
                type="button"
                onClick={handleToggleSave}
                disabled={saving}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  saved
                    ? "bg-emerald-600 text-white shadow-md scale-105 font-bold"
                    : "bg-slate-900/80 text-slate-300 hover:bg-slate-900"
                )}
              >
                <Heart className={cn("h-3.5 w-3.5 transition-colors", saved ? "fill-white text-white" : "text-slate-300 group-hover:text-white")} />
                <span>{saved ? "Saved" : "Save property"}</span>
                {likeCount > 0 && (
                  <span className={cn("ml-0.5 text-[10px] opacity-80 font-mono", saved ? "text-emerald-100" : "text-slate-400")}>
                    ({likeCount})
                  </span>
                )}
              </button>
            </div>
          </div>
          {/* --- RIGHT CONTAINER (30%): Property Details --- */}
          <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-6 sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl leading-snug">
                  {listing.title}
                </h1>
                <p className="flex items-center gap-1.5 text-sm font-medium text-slate-500 sm:text-base">
                  <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
                  {listing.location}                  
                </p>
                <p className="mt-1 text-sm font-extrabold tracking-tight text-slate-600 sm:text-base">
                  Listed for {formatPropertyPrice(listing.price)}
                </p>
              </div>
            </div>

            {listing.aiCrux?.trim() && (
              <div className="mt-4 border-b border-slate-100 pb-4">
                <p 
                  className={cn(
                    "text-sm leading-relaxed text-slate-600 transition-all",
                    // Clamps text to 3 lines cleanly when collapsed
                    !isDescExpanded && "line-clamp-3"
                  )}
                >
                  {listing.aiCrux}
                </p>
                {listing.aiCrux?.length > 120 && (
                  <button
                    type="button"
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="mt-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition"
                  >
                    {isDescExpanded ? "Read less" : "Read more..."}
                  </button>
                )}
              </div>
            )}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/60">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Auditor Rating
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                <StarRating rating={auditorRating} showValue={false} size="sm" />
                <span className="text-sm font-bold text-slate-800">{auditorRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-5 py-6 sm:px-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
          <div className="mt-5 grid grid-cols-5 gap-3">
              <SpecCard icon={<BedDouble className="h-4 w-4 text-emerald-600" />} label="Bedrooms" value={String(listing.bedrooms)} />
              <SpecCard icon={<Bath className="h-4 w-4 text-emerald-600" />} label="Bathrooms" value={String(listing.bathrooms)} />
            </div>
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
