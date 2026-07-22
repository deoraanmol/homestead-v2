/**
 * Nominatim (OpenStreetMap) API wrapper for location autocomplete
 * Free tier: 1 request/second
 * Attribution required in UI
 */

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const TRICITY_BOUNDS = {
  minLat: 30.55,
  maxLat: 30.85,
  minLng: 76.65,
  maxLng: 76.95,
};

export type LocationSuggestion = {
  displayName: string;
  latitude: number;
  longitude: number;
  placeId: string;
  type: "sector" | "locality" | "city" | "area";
};

/**
 * Search for locations using Nominatim
 * Focuses on Tricity area (Chandigarh, Mohali, Panchkula, Zirakpur)
 */
export async function searchLocations(
  query: string
): Promise<LocationSuggestion[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      format: "json",
      viewbox: `${TRICITY_BOUNDS.minLng},${TRICITY_BOUNDS.maxLat},${TRICITY_BOUNDS.maxLng},${TRICITY_BOUNDS.minLat}`,
      bounded: "1",
      limit: "8",
      addressdetails: "1",
    });

    const response = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
      headers: { "User-Agent": "homestead-v2" },
    });

    if (!response.ok) return [];
    const data = await response.json();

    return (data || [])
      .filter(
        (result: Record<string, unknown>) =>
          result.lat && result.lon && result.display_name
      )
      .map((result: Record<string, unknown>) => ({
        displayName: String(result.display_name),
        latitude: parseFloat(String(result.lat)),
        longitude: parseFloat(String(result.lon)),
        placeId: String(result.place_id),
        type: inferLocationType(String(result.display_name)),
      }));
  } catch (error) {
    console.error("Nominatim search error:", error);
    return [];
  }
}

/**
 * Reverse geocode coordinates to get address
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      format: "json",
      zoom: "16",
    });

    const response = await fetch(`${NOMINATIM_BASE}/reverse?${params}`, {
      headers: { "User-Agent": "homestead-v2" },
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.address?.road || data.display_name || null;
  } catch (error) {
    console.error("Nominatim reverse geocode error:", error);
    return null;
  }
}

/**
 * Infer location type from display name
 */
function inferLocationType(
  displayName: string
): "sector" | "locality" | "city" | "area" {
  const lower = displayName.toLowerCase();
  if (/sector\s+\d+/i.test(lower)) return "sector";
  if (/phase\s+\d+|colony|nagar/i.test(lower)) return "locality";
  if (
    /chandigarh|mohali|panchkula|zirakpur|tricity/i.test(lower)
  )
    return "city";
  return "area";
}

/**
 * Get coordinates for a display name
 * Useful for converting saved location strings back to coordinates
 */
export async function getCoordinates(
  locationName: string
): Promise<{ lat: number; lng: number } | null> {
  const suggestions = await searchLocations(locationName);
  if (suggestions.length === 0) return null;
  const first = suggestions[0];
  return {
    lat: first.latitude,
    lng: first.longitude,
  };
}
