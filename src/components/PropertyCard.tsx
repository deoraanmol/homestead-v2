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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-neutral-light transition-all duration-300 hover:shadow-md">
      {/* Visual Header Block */}
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-neutral-light">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listingImage(listing.image_url)}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        
        {/* Price Tag (10% Emerald Accent Over White Backdrop) */}
        <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 text-sm font-bold text-emerald shadow-sm backdrop-blur-sm">
          {formatPrice(listing.price)}
        </div>
        
        {/* Save Toggle Hook */}
        {showSaveButton && onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave();
            }}
            className={cn(
              "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm shadow-sm backdrop-blur-sm transition-all duration-200 z-20",
              saved 
                ? "bg-emerald text-white" 
                : "bg-white/95 text-neutral hover:text-emerald hover:bg-white"
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

      {/* Text Context Frame Info Rows */}
      <div className={cn("flex flex-1 flex-col justify-between", compact ? "p-4" : "p-5 md:p-6")}>
        <div>
          <h4 className="line-clamp-2 text-base font-bold leading-snug text-neutral-dark group-hover:text-emerald-800 transition-colors">
            {listing.title}
          </h4>
          <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500 leading-relaxed">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="line-clamp-2">{listing.location}</span>
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Tag icon={<BedDouble className="h-3.5 w-3.5" />} label={`${listing.bedrooms} Beds`} />
            <Tag icon={<Bath className="h-3.5 w-3.5" />} label={`${listing.bathrooms} Baths`} />
          </div>
        </div>

        {/* Action Button Row */}
        {!compact && (
          <div className="mt-5">
            {href ? (
              <span className="btn-secondary w-full text-center block text-xs font-bold py-2.5 bg-slate-50 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-800 rounded-xl border border-slate-200/60 group-hover:border-emerald-200 transition-all select-none">
                View Details
              </span>
            ) : (
              <button 
                type="button" 
                onClick={onView} 
                className="w-full text-center text-xs font-bold py-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl border border-slate-200/60 hover:border-emerald-200 transition-all select-none"
              >
                View Details
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Link Router Navigation Shells
  if (href) {
    return (
      <Link
        href={href}
        className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300"
      >
        {content}
      </Link>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition duration-300 hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300">
      {content}
    </article>
  );
}

function Tag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
      {icon}
      {label}
    </span>
  );
}