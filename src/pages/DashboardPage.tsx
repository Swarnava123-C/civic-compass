import { lazy, Suspense, useState } from "react";
import StickyNav from "@/components/StickyNav";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { StateInfo } from "@/types/civic";

const ElectionDashboard = lazy(() => import("@/components/ElectionDashboard"));
const HistoricalComparison = lazy(() => import("@/components/HistoricalComparison"));

function LoadingSkeleton() {
  return (
    <div className="py-16 px-4" aria-busy="true">
      <div className="container max-w-5xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mx-auto" />
        <div className="h-96 bg-muted animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}

const DashboardPage = () => {
  const [selectedState] = useState<StateInfo | null>(null);

  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary>
        <StickyNav />
        <div className="pt-4">
          <Suspense fallback={<LoadingSkeleton />}>
            <ElectionDashboard selectedState={selectedState} />
          </Suspense>
          <div className="civic-section-divider" />
          <Suspense fallback={<LoadingSkeleton />}>
            <HistoricalComparison selectedState={selectedState} />
          </Suspense>
        </div>
      </ErrorBoundary>
    </main>
  );
};

export default DashboardPage;
