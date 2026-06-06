import type { Listing } from "@/types/listing";
import { getCoordsForLocation, sortByProximity, type GeoCoords } from "@/lib/geolocation";

export type ListingFilters = {
  locationQuery: string;
  minPrice: string;
  maxPrice: string;
};

export function filterListings(listings: Listing[], filters: ListingFilters): Listing[] {
  const min = filters.minPrice ? Number(filters.minPrice) : 0;
  const max = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
  const q = filters.locationQuery.trim().toLowerCase();

  return listings.filter((listing) => {
    const matchesLocation = !q || listing.location.toLowerCase().includes(q);
    const matchesPrice = listing.price >= min && listing.price <= max;
    return matchesLocation && matchesPrice;
  });
}

export function sortListingsByProximity(
  listings: Listing[],
  userCoords: GeoCoords | null
): Listing[] {
  return sortByProximity(listings, (listing) => listing.location, userCoords);
}

export function paginateListings<T>(items: T[], page: number, pageSize: number): T[] {
  return items.slice(0, page * pageSize);
}

export function listingCoords(listing: Listing) {
  return getCoordsForLocation(listing.location);
}
