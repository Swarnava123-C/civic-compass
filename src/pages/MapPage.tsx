import { lazy, Suspense, useState, useCallback } from "react";
import StickyNav from "@/components/StickyNav";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { StateInfo } from "@/types/civic";

const IndiaMap = lazy(() => import("@/components/IndiaMap"));
const GoogleElectionMap = lazy(() => import("@/components/GoogleElectionMap"));
const StateInfoPanel = lazy(() => import("@/components/StateInfoPanel"));

function LoadingSkeleton() {
  return (
    <div className="py-16 px-4" aria-busy="true" aria-label="Loading section">
      <div className="container max-w-5xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mx-auto" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded mx-auto" />
        <div className="h-96 bg-muted animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}

const MapPage = () => {
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const hasApiKey = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleMapSelect = useCallback((state: StateInfo | null) => {
    setSelectedState(state);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary>
        <StickyNav />
        <div className="pt-4">
          <Suspense fallback={<LoadingSkeleton />}>
            {hasApiKey ? (
              <GoogleElectionMap selectedState={selectedState} onSelectState={handleMapSelect} />
            ) : (
              <IndiaMap selectedState={selectedState} onSelectState={handleMapSelect} />
            )}
          </Suspense>
          {selectedState && (
            <Suspense fallback={<LoadingSkeleton />}>
              <StateInfoPanel selectedState={selectedState} />
            </Suspense>
          )}
        </div>
      </ErrorBoundary>
    </main>
  );
};

export default MapPage;
