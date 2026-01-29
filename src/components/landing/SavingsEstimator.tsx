"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Building2, DollarSign, Users, Package } from "lucide-react";
import { PlaceSearch } from "./PlaceSearch";

interface PlaceResult {
  name: string;
  address: string;
  types: string[];
  placeId: string;
  website?: string;
}

interface EstimateResult {
  practice: {
    practiceType: string;
    monthlySupplySpend: number;
    vendorCount: number;
    providerCount: number;
    reasoning: string;
  };
  savings: {
    annualSpend: number;
    errorRate: number;
    estimatedLeakage: number;
    recoveryRange: {
      low: number;
      high: number;
    };
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SavingsEstimator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceSelect = useCallback(async (place: PlaceResult) => {
    setSelectedPlace(place);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: place.name,
          address: place.address,
          types: place.types,
          website: place.website,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate estimate");

      const data: EstimateResult = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <section className="border-t border-stone-200">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-stone-400">
            Savings estimator
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-heading font-(family-name:--font-newsreader)">
            How much are invoice errors costing you?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-stone-600">
            Search for your practice and we&apos;ll estimate your potential
            annual recovery based on industry benchmarks.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-md">
          <PlaceSearch onSelect={handlePlaceSelect} isLoading={isLoading} />
        </div>

        {/* Loading state */}
        {isLoading && selectedPlace && (
          <div className="mt-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-heading" />
            <p className="mt-4 text-sm text-stone-500">
              Analyzing {selectedPlace.name}...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mt-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && selectedPlace && (
          <div className="mt-10">
            {/* Practice info */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-heading">
                    {selectedPlace.name}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {selectedPlace.address}
                  </p>
                </div>
                <span className="rounded-lg bg-stone-200 px-2.5 py-1 text-xs font-medium text-stone-600">
                  {result.practice.practiceType}
                </span>
              </div>

              {/* Inferred details */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-stone-400" />
                  <div>
                    <p className="text-xs text-stone-500">Providers</p>
                    <p className="text-sm font-medium text-heading">
                      {result.practice.providerCount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-stone-400" />
                  <div>
                    <p className="text-xs text-stone-500">Vendors</p>
                    <p className="text-sm font-medium text-heading">
                      {result.practice.vendorCount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-stone-400" />
                  <div>
                    <p className="text-xs text-stone-500">Monthly spend</p>
                    <p className="text-sm font-medium text-heading">
                      {formatCurrency(result.practice.monthlySupplySpend)}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-stone-400 italic">
                {result.practice.reasoning}
              </p>
            </div>

            {/* Savings result */}
            <div className="mt-4 rounded-xl border border-stone-200 bg-white p-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Building2 className="h-4 w-4 text-stone-400" />
                <p className="text-sm text-stone-500">
                  Estimated annual recovery
                </p>
              </div>
              <p className="mt-3 text-4xl font-medium tracking-tight text-heading font-(family-name:--font-newsreader)">
                {formatCurrency(result.savings.recoveryRange.low)} &ndash;{" "}
                {formatCurrency(result.savings.recoveryRange.high)}
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Based on a {result.savings.errorRate}% error rate across{" "}
                {formatCurrency(result.savings.annualSpend)} in annual supply
                spend
              </p>

              <Link
                href="/home"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-heading px-6 py-3 text-sm font-medium text-stone-50 transition-colors hover:bg-heading-hover"
              >
                Talk to Founder
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-stone-400">
              Estimates based on APQC and industry benchmarks for healthcare
              supply chain. Actual recovery depends on vendor mix and contract
              terms.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
