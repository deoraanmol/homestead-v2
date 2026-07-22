import { MOCK_LISTINGS } from "@/data/mock-listings";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Listing } from "@/types/listing";

export async function resolveListingById(id: string): Promise<Listing | null> {
  if (!id) return null;

  if (isSupabaseConfigured()) {
    try {
      const response = await fetch(`/api/listings/${encodeURIComponent(id)}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return null;
      }

      const body = (await response.json()) as { data?: Listing };
      return body.data ?? null;
    } catch {
      return null;
    }
  }

  return MOCK_LISTINGS.find((listing) => listing.id === id) ?? null;
}

export function resolveListingByIdSync(id: string, listings: Listing[]): Listing | null {
  return listings.find((listing) => listing.id === id) ?? MOCK_LISTINGS.find((l) => l.id === id) ?? null;
}
