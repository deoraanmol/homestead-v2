"use client";

import { Heart, MessageCircle, Phone } from "lucide-react";

type Props = {
  agentName?: string;
  agencyName?: string;
  location?: string;
  phone: string;
  imageUrl?: string;
  onMessage: () => void;
};

export function PropertyDetailsContactAgent({
  agentName = "Rahul Sharma",
  agencyName = "Prime Property Group",
  location = "Chandigarh, Punjab",
  phone,
  imageUrl = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
  onMessage,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">

      {/* Agency */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Contact agent
        </h2>

        <p className="mt-1 text-sm font-medium text-slate-700">
          {agencyName}
        </p>

        <p className="text-xs text-slate-500">
          {location}
        </p>
      </div>


      {/* Agent */}
      <div className="mt-5 flex items-center gap-4 border-t border-slate-100 pt-5">

        <img
          src={imageUrl}
          alt={agentName}
          className="
            h-16 w-16 rounded-full
            object-cover
            ring-2 ring-emerald-100
          "
        />

        <div className="flex-1">

          <p className="font-semibold text-slate-900">
            {agentName}
          </p>

          <p className="text-sm text-slate-500">
            Property Consultant
          </p>
        </div>
      </div>


      {/* Actions */}
      <div className="mt-5 space-y-3">

        <button
            type="button"
            onClick={onMessage}
            className="
                w-full rounded-xl
                bg-emerald-600
                px-4 py-3
                text-sm font-semibold
                text-white
                hover:bg-emerald-700
            "
            >
            Get in touch
        </button>

        <a
        href={`tel:${phone}`}
        className="
            mt-3
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-emerald-600
            bg-white
            px-4 py-3
            text-sm font-semibold
            text-emerald-700
            transition
            hover:bg-emerald-50
        "
        >
        <Phone className="h-4 w-4" />
        Call
        </a>
        <button
          type="button"
          className="
            flex w-full items-center justify-center gap-2
            rounded-xl border border-slate-200
            px-4 py-3
            text-sm font-semibold text-slate-700
            hover:bg-slate-50
          "
        >
          <Heart className="h-4 w-4" />
          Save property
        </button>

      </div>

    </section>
  );
}