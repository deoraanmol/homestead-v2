"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function useLocationSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current context, defaulting back to your base hub core
  const currentCity = searchParams.get("city") || "Chandigarh";
  const currentRegion = searchParams.get("region") || "Tricity";

  function setGlobalLocation(city: string, region: string = "Tricity") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("city", city);
    params.set("region", region);
    
    // Smooth navigation update without hard-reloading the browser tabs
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return { currentCity, currentRegion, setGlobalLocation };
}