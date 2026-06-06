"use client";

import { useEffect, useState } from "react";
import { requestUserLocation, type GeoCoords } from "@/lib/geolocation";

export function useGeolocation() {
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    requestUserLocation().then((result) => {
      if (!cancelled) {
        setCoords(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { coords, loading, available: coords !== null };
}
