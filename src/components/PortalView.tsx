"use client";

import { BuyListingsView } from "@/components/BuyListingsView";
import type { Listing } from "@/types/listing";

type Props = {
  listings: Listing[];
  loading?: boolean;
};

/** @deprecated Use BuyListingsView on /buy — kept for backward compatibility */
export function PortalView({ listings, loading }: Props) {
  return <BuyListingsView listings={listings} loading={loading} />;
}
