"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  searchLocations,
  type LocationSuggestion,
} from "@/lib/nominatim";

type UseLocationAutocompleteReturn = {
  suggestions: LocationSuggestion[];
  isLoading: boolean;
  query: string;
  setQuery: (q: string) => void;
  selectSuggestion: (suggestion: LocationSuggestion) => void;
  selectedLocation: LocationSuggestion | null;
  clearSearch: () => void;
};

export function useLocationAutocomplete(): UseLocationAutocompleteReturn {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchLocations(searchQuery);
      setSuggestions(results);
    } catch (error) {
      console.error("Autocomplete search failed:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setSelectedLocation(null);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      performSearch(newQuery);
    }, 300);
  }, [performSearch]);

  const handleSelectSuggestion = useCallback(
    (suggestion: LocationSuggestion) => {
      setSelectedLocation(suggestion);
      setQuery(suggestion.displayName);
      setSuggestions([]);
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    setSelectedLocation(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    suggestions,
    isLoading,
    query,
    setQuery: handleQueryChange,
    selectSuggestion: handleSelectSuggestion,
    selectedLocation,
    clearSearch: handleClearSearch,
  };
}
