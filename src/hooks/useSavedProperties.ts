"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchSavedListingIds,
  isSupabaseConfigured,
  saveListingForUser,
  unsaveListingForUser,
} from "@/lib/supabase";
import {
  getLocalSavedIds,
  setLocalSavedIds,
  toggleLocalSaved,
} from "@/lib/saved-local";
import { useAuth } from "@/context/AuthProvider";

export function useSavedProperties() {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setSavedIds([]);
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured()) {
      const ids = await fetchSavedListingIds(user.id);
      setSavedIds(ids);
    } else {
      setSavedIds(getLocalSavedIds(user.id));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const isSaved = useCallback(
    (listingId: string) => savedIds.includes(listingId),
    [savedIds]
  );

  const toggleSave = useCallback(
    async (listingId: string) => {
      if (!user) return false;

      const currentlySaved = savedIds.includes(listingId);

      if (isSupabaseConfigured()) {
        const result = currentlySaved
          ? await unsaveListingForUser(user.id, listingId)
          : await saveListingForUser(user.id, listingId);
        if (!result.ok) return false;
        setSavedIds((prev) =>
          currentlySaved
            ? prev.filter((id) => id !== listingId)
            : [listingId, ...prev]
        );
        return true;
      }

      const next = toggleLocalSaved(user.id, listingId);
      setSavedIds(next);
      return true;
    },
    [user, savedIds]
  );

  const syncLocal = useCallback(
    (ids: string[]) => {
      if (user && !isSupabaseConfigured()) {
        setLocalSavedIds(user.id, ids);
      }
      setSavedIds(ids);
    },
    [user]
  );

  return { savedIds, loading, isSaved, toggleSave, reload: load, syncLocal };
}
