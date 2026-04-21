import { lazy, Suspense, useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import ElectionOverview from "@/components/ElectionOverview";
import StateSelector from "@/components/StateSelector";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { StateInfo } from "@/types/civic";

const Timeline = lazy(() => import("@/components/Timeline"));
const VotingGuide = lazy(() => import("@/components/VotingGuide"));
const ScenarioSimulator = lazy(() => import("@/components/ScenarioSimulator"));
const GovernmentStructure = lazy(() => import("@/components/GovernmentStructure"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const ChatBox = lazy(() => import("@/components/ChatBox"));
const CivicQuiz = lazy(() => import("@/components/CivicQuiz"));
const StateInfoPanel = lazy(() => import("@/components/StateInfoPanel"));

function LoadingSkeleton() {
  return (
    <div className="py-16 px-4" aria-busy="true" aria-label="Loading section">
      <div className="container max-w-4xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mx-auto" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded mx-auto" />
        <div className="h-40 bg-muted animate-pulse rounded-xl" />
      </div>
    </div>
  );
}

const Index = () => {
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);

  const handleStateSelect = useCallback((state: StateInfo | null) => {
    setSelectedState(state);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary>
        <HeroSection />

        {/* State selector bar */}
        <div className="border-b bg-card py-3 px-4 sticky top-0 z-10">
          <div className="container max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <StateSelector selectedState={selectedState} onSelect={handleStateSelect} />
            {selectedState && (
              <span className="civic-badge-info font-sans">
                Viewing info for {selectedState.name}
              </span>
            )}
          </div>
        </div>

        {/* State-specific info panel */}
        {selectedState && (
          <Suspense fallback={<LoadingSkeleton />}>
            <StateInfoPanel selectedState={selectedState} />
          </Suspense>
        )}

        <ElectionOverview />

        <Suspense fallback={<LoadingSkeleton />}>
          <Timeline />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <VotingGuide />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <ScenarioSimulator />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <GovernmentStructure />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <FAQSection />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <ChatBox />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <CivicQuiz />
        </Suspense>

        {/* Footer */}
        <footer className="py-8 px-4 border-t bg-card" role="contentinfo">
          <div className="container max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground font-sans">
              <strong>Disclaimer:</strong> CivicFlow Pro is an educational tool and is not an official government source.
              Always verify election information with your local election authority.
            </p>
            <p className="text-xs text-muted-foreground font-sans mt-2">
              © {new Date().getFullYear()} CivicFlow Pro — Interactive Civic Education & Election Process Intelligence Platform
            </p>
          </div>
        </footer>
      </ErrorBoundary>
    </main>
  );
};

export default Index;
