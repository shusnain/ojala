"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PlaceResult {
  name: string;
  address: string;
  types: string[];
  placeId: string;
  website?: string;
}

interface PlaceSearchProps {
  onSelect: (place: PlaceResult) => void;
  isLoading: boolean;
}

interface Suggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
}

export function PlaceSearch({ onSelect, isLoading }: PlaceSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load Google Maps script using recommended async pattern
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.maps?.places) {
      setScriptLoaded(true);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    // Check if script is already being loaded
    const existing = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => setScriptLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleInput = useCallback(
    async (value: string) => {
      setQuery(value);
      if (!value.trim() || !scriptLoaded) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } =
          google.maps.places;

        const token = new AutocompleteSessionToken();
        const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions(
          {
            input: value,
            sessionToken: token,
            includedPrimaryTypes: ["establishment"],
          }
        );

        const mapped: Suggestion[] = response.suggestions
          .filter((s) => s.placePrediction)
          .map((s) => ({
            placeId: s.placePrediction!.placeId,
            mainText: s.placePrediction!.mainText?.text || "",
            secondaryText: s.placePrediction!.secondaryText?.text || "",
          }));

        setSuggestions(mapped);
        setShowDropdown(mapped.length > 0);
      } catch {
        setSuggestions([]);
      }
    },
    [scriptLoaded]
  );

  const handleSelect = useCallback(
    async (suggestion: Suggestion) => {
      setQuery(suggestion.mainText);
      setShowDropdown(false);

      try {
        const { Place } = google.maps.places;
        const place = new Place({ id: suggestion.placeId });
        await place.fetchFields({
          fields: [
            "displayName",
            "formattedAddress",
            "types",
            "websiteURI",
            "id",
          ],
        });

        onSelect({
          name: place.displayName || suggestion.mainText,
          address: place.formattedAddress || suggestion.secondaryText,
          types: place.types || [],
          placeId: place.id || suggestion.placeId,
          website: place.websiteURI || undefined,
        });
      } catch {
        // Fallback with what we have from the suggestion
        onSelect({
          name: suggestion.mainText,
          address: suggestion.secondaryText,
          types: [],
          placeId: suggestion.placeId,
        });
      }
    },
    [onSelect]
  );

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="Search for your practice..."
        disabled={isLoading}
        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-heading placeholder:text-stone-400 focus:border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 disabled:opacity-60"
      />

      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full z-50 mt-1 w-full rounded-xl border border-stone-200 bg-white shadow-lg"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.placeId}
              onClick={() => handleSelect(suggestion)}
              className="flex w-full flex-col px-4 py-3 text-left transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-stone-50"
            >
              <span className="text-sm font-medium text-heading">
                {suggestion.mainText}
              </span>
              <span className="text-xs text-stone-500">
                {suggestion.secondaryText}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
