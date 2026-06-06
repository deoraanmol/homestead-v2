import { MOCK_LISTINGS } from "@/data/mock-listings";
import { fetchListingById, isSupabaseConfigured } from "@/lib/supabase";
import type { Listing } from "@/types/listing";

export async function resolveListingById(id: string): Promise<Listing | null> {
  if (isSupabaseConfigured()) {
    const fromDb = await fetchListingById(id);
    if (fromDb) return fromDb;
  }
  return MOCK_LISTINGS.find((listing) => listing.id === id) ?? null;
}

export function resolveListingByIdSync(id: string, listings: Listing[]): Listing | null {
  return listings.find((listing) => listing.id === id) ?? MOCK_LISTINGS.find((l) => l.id === id) ?? null;
}
