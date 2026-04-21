import { lazy, Suspense, useState, useCallback, useMemo } from "react";
import HeroSection from "@/components/HeroSection";
import ElectionOverview from "@/components/ElectionOverview";
import StickyNav from "@/components/StickyNav";
import UserProfilePanel from "@/components/UserProfilePanel";
import LearningRecapButton from "@/components/LearningRecapButton";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { StateInfo, UserProfile } from "@/types/civic";

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
        <div className="h-40 bg-muted animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}

const DEFAULT_PROFILE: UserProfile = {
  state: null,
  age: null,
  needsRegistrationHelp: false,
  needsIdHelp: false,
};

const Index = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizTotal, setQuizTotal] = useState(0);
  const [viewedScenarios, setViewedScenarios] = useState<Set<string>>(new Set());

  const selectedState = profile.state;

  const handleStateFromProfile = useCallback((updated: UserProfile) => {
    setProfile(updated);
  }, []);

  const handleScenarioView = useCallback((id: string) => {
    setViewedScenarios((prev) => new Set(prev).add(id));
  }, []);

  const handleQuizComplete = useCallback((score: number, total: number) => {
    setQuizScore(score);
    setQuizTotal(total);
  }, []);

  const recapData = useMemo(() => ({
    quizScore,
    quizTotal,
    completedScenarioIds: Array.from(viewedScenarios),
    profile,
  }), [quizScore, quizTotal, viewedScenarios, profile]);

  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary>
        <HeroSection />
        <StickyNav />

        {/* Profile + Controls bar */}
        <div className="py-4 px-4">
          <div className="container max-w-4xl mx-auto space-y-3">
            <UserProfilePanel
              profile={profile}
              onUpdate={handleStateFromProfile}
              isOpen={profileOpen}
              onToggle={() => setProfileOpen(!profileOpen)}
            />
            <div className="flex items-center justify-between flex-wrap gap-3">
              {selectedState && (
                <span className="civic-badge-info font-sans">
                  Viewing info for {selectedState.name}
                </span>
              )}
              <LearningRecapButton recapData={recapData} />
            </div>
          </div>
        </div>

        <div className="civic-section-divider" />

        {selectedState && (
          <Suspense fallback={<LoadingSkeleton />}>
            <StateInfoPanel selectedState={selectedState} />
          </Suspense>
        )}

        <ElectionOverview />
        <div className="civic-section-divider" />

        <Suspense fallback={<LoadingSkeleton />}>
          <Timeline />
        </Suspense>
        <div className="civic-section-divider" />

        <Suspense fallback={<LoadingSkeleton />}>
          <VotingGuide />
        </Suspense>
        <div className="civic-section-divider" />

        <Suspense fallback={<LoadingSkeleton />}>
          <ScenarioSimulator onScenarioView={handleScenarioView} />
        </Suspense>
        <div className="civic-section-divider" />

        <Suspense fallback={<LoadingSkeleton />}>
          <GovernmentStructure />
        </Suspense>
        <div className="civic-section-divider" />

        <Suspense fallback={<LoadingSkeleton />}>
          <FAQSection />
        </Suspense>
        <div className="civic-section-divider" />

        <Suspense fallback={<LoadingSkeleton />}>
          <ChatBox profile={profile} />
        </Suspense>
        <div className="civic-section-divider" />

        <Suspense fallback={<LoadingSkeleton />}>
          <CivicQuiz onComplete={handleQuizComplete} />
        </Suspense>

        {/* Footer */}
        <footer className="py-10 px-4 border-t bg-card" role="contentinfo">
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
