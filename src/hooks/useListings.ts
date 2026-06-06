"use client";

import { useEffect, useState } from "react";
import { MOCK_LISTINGS } from "@/data/mock-listings";
import { fetchListingsFromSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { DataSource, Listing } from "@/types/listing";

export function useListings() {
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [dataSource, setDataSource] = useState<DataSource>("mock");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setStatusMessage(null);

      if (!isSupabaseConfigured()) {
        if (!cancelled) {
          setListings(MOCK_LISTINGS);
          setDataSource("mock");
          setStatusMessage("Using mock data — add Supabase env vars to connect.");
          setLoading(false);
        }
        return;
      }

      const result = await fetchListingsFromSupabase();
      if (cancelled) return;

      if (result.source === "supabase" && result.data.length > 0) {
        setListings(result.data);
        setDataSource("supabase");
      } else if (result.source === "supabase") {
        setListings([]);
        setDataSource("supabase");
        setStatusMessage("Connected to Supabase — no listings yet.");
      } else {
        setListings(MOCK_LISTINGS);
        setDataSource("mock");
        setStatusMessage(
          result.error
            ? `Supabase unavailable (${result.error}). Using mock data.`
            : "Using mock data."
        );
      }

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { listings, setListings, dataSource, loading, statusMessage, setStatusMessage };
}
