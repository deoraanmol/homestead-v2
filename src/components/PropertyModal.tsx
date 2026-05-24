"use client";

import { FormEvent, useEffect, useState } from "react";
import { Bath, BedDouble, MapPin, X } from "lucide-react";
import { cn, formatPrice, listingImage } from "@/lib/utils";
import type { Listing } from "@/types/listing";

type Props = {
  listing: Listing;
  onClose: () => void;
};

export function PropertyModal({ listing, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="property-modal-title"
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/9] bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listingImage(listing.image_url)}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/95 p-2 text-slate-700 shadow transition hover:bg-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 id="property-modal-title" className="text-2xl font-bold text-slate-900">
                {listing.title}
              </h2>
              <p className="mt-2 flex items-center gap-1.5 text-slate-500">
                <MapPin className="h-4 w-4" />
                {listing.location}
              </p>
            </div>
            <p className="text-2xl font-bold text-brand-700">{formatPrice(listing.price)}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <SpecPill icon={<BedDouble className="h-4 w-4" />} text={`${listing.bedrooms} bedrooms`} />
            <SpecPill icon={<Bath className="h-4 w-4" />} text={`${listing.bathrooms} bathrooms`} />
          </div>

          <p className="mt-6 leading-relaxed text-slate-600">{listing.description}</p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Contact agent</h3>
            <p className="mt-1 text-sm text-slate-500">
              Send an enquiry about this property (simulated for demo).
            </p>

            {submitted ? (
              <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
                Thanks, {form.name || "there"}! Your enquiry has been sent. An agent will contact
                you at {form.email || "your email"} shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <input
                  required
                  className={inputClass}
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  required
                  type="email"
                  className={inputClass}
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <textarea
                  required
                  className={cn(inputClass, "min-h-[96px] resize-y")}
                  placeholder={`I'm interested in ${listing.title}...`}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Send enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200">
      {icon}
      {text}
    </span>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";