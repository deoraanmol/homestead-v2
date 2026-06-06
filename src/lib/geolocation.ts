export type GeoCoords = {
  lat: number;
  lng: number;
};

const TRICITY_COORDS: Record<string, GeoCoords> = {
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  mohali: { lat: 30.7046, lng: 76.7179 },
  panchkula: { lat: 30.6943, lng: 76.8606 },
  zirakpur: { lat: 30.6426, lng: 76.8173 },
};

export function getCoordsForLocation(text: string): GeoCoords {
  const lower = text.toLowerCase();
  if (lower.includes("zirakpur")) return TRICITY_COORDS.zirakpur;
  if (lower.includes("mohali")) return TRICITY_COORDS.mohali;
  if (lower.includes("panchkula")) return TRICITY_COORDS.panchkula;
  return TRICITY_COORDS.chandigarh;
}

export function distanceKm(a: GeoCoords, b: GeoCoords): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function requestUserLocation(): Promise<GeoCoords | null> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  });
}

export function sortByProximity<T>(
  items: T[],
  getLocationText: (item: T) => string,
  userCoords: GeoCoords | null
): T[] {
  if (!userCoords) return items;

  return [...items].sort((a, b) => {
    const distA = distanceKm(userCoords, getCoordsForLocation(getLocationText(a)));
    const distB = distanceKm(userCoords, getCoordsForLocation(getLocationText(b)));
    return distA - distB;
  });
}
