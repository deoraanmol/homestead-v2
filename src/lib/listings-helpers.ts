import type { Listing } from "@/types/listing";
import { getCoordsForLocation, sortByProximity, type GeoCoords, setCoordsForLocation } from "@/lib/geolocation";

export type ListingFilters = {
  locationQuery: string;
  minPrice: string;
  maxPrice: string;
  propertyTypeId: string;
};

export function filterListings(listings: Listing[], filters: ListingFilters): Listing[] {
  const min = filters.minPrice ? Number(filters.minPrice) : 0;
  const max = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
  const q = filters.locationQuery.trim().toLowerCase();
  const propertyTypeId = filters.propertyTypeId.trim();

  const matchesBase = (listing: Listing) => {
    const matchesPrice = listing.price >= min && listing.price <= max;
    const matchesType =
      !propertyTypeId || listing.property_type_id === propertyTypeId;
    return matchesPrice && matchesType;
  };

  // If no location query, return all price/type-filtered results
  if (!q) {
    return listings.filter(matchesBase);
  }

  // Try to match by location
  let matched = listings.filter((listing) => {
    const matchesLocation = listing.location.toLowerCase().includes(q);
    return matchesLocation && matchesBase(listing);
  });

  // If no matches found, return all price/type-filtered listings
  // (never show "no results" - show closest properties instead)
  if (matched.length === 0) {
    matched = listings.filter(matchesBase);
  }

  return matched;
}

export function sortListingsByProximity(
  listings: Listing[],
  userCoords: GeoCoords | null,
  userLocationQuery?: string
): Listing[] {
  // If we have a location query, cache its coordinates for future use
  if (userLocationQuery) {
    const coords = getCoordsForLocation(userLocationQuery);
    setCoordsForLocation(userLocationQuery, coords);
  }

  return sortByProximity(listings, (listing) => listing.location, userCoords);
}

export function paginateListings<T>(items: T[], page: number, pageSize: number): T[] {
  return items.slice(0, page * pageSize);
}

export function listingCoords(listing: Listing) {
  return getCoordsForLocation(listing.location);
}
