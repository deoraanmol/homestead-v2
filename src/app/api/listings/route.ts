import { NextRequest, NextResponse } from "next/server";
import { MOCK_LISTINGS } from "@/data/mock-listings";
import { LISTING_CONFIG } from "@/lib/config";
import { fetchListingsFromSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { distanceKm, getCoordsForLocation, type GeoCoords } from "@/lib/geolocation";
import type { Listing } from "@/types/listing";

export const runtime = "nodejs";

function paginateInMemory(listings: Listing[], page: number, pageSize: number) {
  const total = listings.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: listings.slice(start, end),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

function sortByProximity(listings: Listing[], coords: GeoCoords) {
  return [...listings].sort((a, b) => {
    const distA = distanceKm(coords, getCoordsForLocation(a.location));
    const distB = distanceKm(coords, getCoordsForLocation(b.location));
    return distA - distB;
  });
}

/** Prefer listings near the user; if none are nearby, keep all sorted by distance. */
function filterByUserCoordinates(listings: Listing[], coords: GeoCoords) {
  const withDistance = listings.map((listing) => ({
    listing,
    distance: distanceKm(coords, getCoordsForLocation(listing.location)),
  }));

  const nearby = withDistance.filter(
    (item) => item.distance <= LISTING_CONFIG.NEARBY_RADIUS_KM
  );
  const pool = nearby.length > 0 ? nearby : withDistance;

  return pool
    .sort((a, b) => a.distance - b.distance)
    .map((item) => item.listing);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get("location") || "";
    const propertyTypeId = searchParams.get("propertyTypeId") || "";
    const minPrice = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : 0;
    const maxPrice = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : Infinity;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(searchParams.get("pageSize")) || LISTING_CONFIG.PAGE_SIZE)
    );
    const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : null;
    const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : null;
    const userCoords =
      lat !== null && lng !== null && !Number.isNaN(lat) && !Number.isNaN(lng)
        ? { lat, lng }
        : null;

    const hasTextOrPriceFilters =
      location.trim() !== "" ||
      propertyTypeId.trim() !== "" ||
      minPrice > 0 ||
      Number.isFinite(maxPrice);

    // Initial browse without shared location: paginate by created_at in the DB.
    if (isSupabaseConfigured() && !hasTextOrPriceFilters && !userCoords) {
      const result = await fetchListingsFromSupabase({ page, pageSize });
      if (result.source === "supabase") {
        return NextResponse.json({
          data: result.data,
          pagination: result.pagination ?? {
            page,
            pageSize,
            total: result.data.length,
            totalPages: 1,
            hasMore: false,
          },
          meta: { sortedBy: "created_at" as const },
        });
      }
    }

    // Filtered search and/or shared-location initial browse.
    let listings: Listing[] = [];
    if (isSupabaseConfigured()) {
      const result = await fetchListingsFromSupabase({ page: 1, pageSize: 100 });
      listings = result.data || [];
    } else {
      listings = MOCK_LISTINGS;
    }

    let filtered = listings.filter((listing) => {
      const matchesPrice = listing.price >= minPrice && listing.price <= maxPrice;
      const matchesType =
        !propertyTypeId.trim() || listing.property_type_id === propertyTypeId.trim();
      return matchesPrice && matchesType;
    });

    let sortedBy: "proximity" | "location" | "created_at" = "created_at";

    if (location.trim()) {
      const query = location.trim().toLowerCase();
      const locationMatched = filtered.filter((listing) =>
        listing.location.toLowerCase().includes(query)
      );

      // If no matches, keep price-filtered results (never empty on location miss).
      if (locationMatched.length > 0) {
        filtered = locationMatched;
      }

      filtered = sortByProximity(filtered, getCoordsForLocation(location));
      sortedBy = "location";
    } else if (userCoords) {
      // Initial browse with shared browser location.
      filtered = filterByUserCoordinates(filtered, userCoords);
      sortedBy = "proximity";
    }

    return NextResponse.json({
      ...paginateInMemory(filtered, page, pageSize),
      meta: { sortedBy },
    });
  } catch (error) {
    console.error("Listings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
