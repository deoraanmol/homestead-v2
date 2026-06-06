"use client";

import Link from "next/link";
import { Briefcase, MapPin } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import type { Dealer } from "@/types/dealer";

type Props = {
  dealer: Dealer;
};

export function DealerCard({ dealer }: Props) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start gap-4 p-5 sm:p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dealer.photoUrl}
          alt={dealer.name}
          className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white shadow"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{dealer.name}</h3>
          <StarRating rating={dealer.rating} showValue size="sm" className="mt-1" />
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {dealer.area}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-brand-600" />
            {dealer.yearsExperience} yrs experience
          </span>
          <span>{dealer.activeListings} active listings</span>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{dealer.bio}</p>
        <Link href={`/dealer/${dealer.id}`} className="btn-primary mt-5 w-full">
          View Profile
        </Link>
      </div>
    </article>
  );
}
