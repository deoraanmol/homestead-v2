"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Bath,
  BedDouble,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react";
import { cn, formatPrice, listingGalleryImages } from "@/lib/utils";
import type { Listing } from "@/types/listing";

type Props = {
  listing: Listing;
  onClose: () => void;
};

export function PropertyModal({ listing, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const images = listingGalleryImages(listing.image_url);
  const hasMultipleImages = images.length > 1;
  const currentImage = images[imageIndex] ?? images[0];

  const goToPrev = useCallback(() => {
    setImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    setImageIndex(0);
    setDetailsOpen(false);
    setSubmitted(false);
    setForm({ name: "", email: "", message: "" });
  }, [listing.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (!hasMultipleImages) return;
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, hasMultipleImages, goToPrev, goToNext]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-modal-title"
    >
      <div
        className="flex max-h-[100dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/10] shrink-0 bg-slate-100 sm:aspect-[16/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={currentImage}
            src={currentImage}
            alt={`${listing.title} — photo ${imageIndex + 1}`}
            className="h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/95 p-2.5 text-slate-700 shadow-md transition hover:bg-white sm:right-4 sm:top-4"
            aria-label="Close property details"
          >
            <X className="h-5 w-5" />
          </button>

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={goToPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2.5 text-slate-800 shadow-md transition hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2.5 text-slate-800 shadow-md transition hover:bg-white sm:right-14"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-slate-900/50 px-2.5 py-1.5 backdrop-blur-sm">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImageIndex(i)}
                    className={cn(
                      "h-2 w-2 rounded-full transition",
                      i === imageIndex ? "bg-white" : "bg-white/40 hover:bg-white/70"
                    )}
                    aria-label={`View image ${i + 1}`}
                    aria-current={i === imageIndex}
                  />
                ))}
              </div>
              <span className="absolute left-3 top-3 rounded-lg bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {imageIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        <div className="overflow-y-auto">
          <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-5 sm:px-8 sm:py-6">
            <p className="text-2xl font-bold tracking-tight text-brand-700 sm:text-3xl">
              {formatPrice(listing.price)}
            </p>
            <h2
              id="property-modal-title"
              className="mt-2 text-xl font-bold leading-snug text-slate-900 sm:text-2xl"
            >
              {listing.title}
            </h2>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600 sm:text-base">
              <MapPin className="h-4 w-4 shrink-0 text-brand-600" />
              {listing.location}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <SpecCard
                icon={<BedDouble className="h-4 w-4 text-brand-600" />}
                label="Bedrooms"
                value={String(listing.bedrooms)}
              />
              <SpecCard
                icon={<Bath className="h-4 w-4 text-brand-600" />}
                label="Bathrooms"
                value={String(listing.bathrooms)}
              />
            </div>
          </div>

          <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
            <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <button
                type="button"
                onClick={() => setDetailsOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-3 bg-white px-4 py-4 text-left transition hover:bg-slate-50 sm:px-5"
                aria-expanded={detailsOpen}
              >
                <span className="text-base font-semibold text-slate-900">More details</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200",
                    detailsOpen && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  detailsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-slate-100 px-4 pb-5 pt-2 sm:px-5">
                    {listing.description.trim() ? (
                      <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                        {listing.description}
                      </p>
                    ) : (
                      <p className="text-sm italic text-slate-400">
                        No additional description provided for this property.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 sm:p-6">
              <h3 className="text-lg font-semibold text-slate-900">Contact agent</h3>
              <p className="mt-1 text-sm text-slate-500">
                Send an enquiry about this property (simulated for demo).
              </p>

              {submitted ? (
                <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
                  Thanks, {form.name || "there"}! Your enquiry has been sent. An agent
                  will contact you at {form.email || "your email"} shortly.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                  <input
                    required
                    className="input-field bg-white"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    required
                    type="email"
                    className="input-field bg-white"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <textarea
                    required
                    className={cn("input-field min-h-[96px] resize-y bg-white")}
                    placeholder={`I'm interested in ${listing.title}...`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  <button type="submit" className="btn-primary w-full py-3">
                    Send enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
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
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
