"use client";

import Link from "next/link";
import { Bath, BedDouble, Heart, MapPin } from "lucide-react";
import { cn, formatPrice, listingImage } from "@/lib/utils";
import type { Listing } from "@/types/listing";

type Props = {
  listing: Listing;
  href?: string;
  onView?: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
  showSaveButton?: boolean;
  compact?: boolean;
};

export function PropertyCard({
  listing,
  href,
  onView,
  saved,
  onToggleSave,
  showSaveButton,
  compact,
}: Props) {
  const content = (
    <>
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listingImage(listing.image_url)}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 text-sm font-bold text-brand-700 shadow-sm backdrop-blur-sm">
          {formatPrice(listing.price)}
        </div>
        {showSaveButton && onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave();
            }}
            className={cn(
              "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm shadow-sm backdrop-blur-sm transition",
              saved ? "bg-brand-600 text-white" : "bg-white/95 text-slate-600 hover:text-brand-600 hover:bg-white"
            )}
            aria-label={saved ? "Remove from saved" : "Save property"}
          >
            <Heart className={cn("h-4 w-4", saved && "fill-current")} />
            {listing.like_count !== undefined && (
              <span className="text-xs font-semibold">{listing.like_count}</span>
            )}
          </button>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "p-4" : "p-5 md:p-6")}>
        <h4 className="line-clamp-2 text-lg font-semibold leading-snug text-slate-900">
          {listing.title}
        </h4>
        <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-slate-500">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="line-clamp-2">{listing.location}</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Tag icon={<BedDouble className="h-3.5 w-3.5" />} label={`${listing.bedrooms} beds`} />
          <Tag icon={<Bath className="h-3.5 w-3.5" />} label={`${listing.bathrooms} baths`} />
        </div>

        {!compact && (
          href ? (
            <span className="btn-secondary mt-5 w-full">View Details</span>
          ) : (
            <button type="button" onClick={onView} className="btn-secondary mt-5 w-full">
              View Details
            </button>
          )
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-slate-300"
      >
        {content}
      </Link>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-slate-300">
      {content}
    </article>
  );
}

function Tag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
      {icon}
      {label}
    </span>
  );
}
