import { lazy, Suspense, useState, useCallback } from "react";
import StickyNav from "@/components/StickyNav";
import ErrorBoundary from "@/components/ErrorBoundary";

const CivicQuiz = lazy(() => import("@/components/CivicQuiz"));
const LearningPath = lazy(() => import("@/components/LearningPath"));

function LoadingSkeleton() {
  return (
    <div className="py-16 px-4" aria-busy="true">
      <div className="container max-w-5xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mx-auto" />
        <div className="h-64 bg-muted animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}

const QuizPage = () => {
  const handleQuizComplete = useCallback((_score: number, _total: number) => {}, []);

  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary>
        <StickyNav />
        <div className="pt-4">
          <Suspense fallback={<LoadingSkeleton />}>
            <LearningPath />
          </Suspense>
          <div className="civic-section-divider" />
          <Suspense fallback={<LoadingSkeleton />}>
            <CivicQuiz onComplete={handleQuizComplete} />
          </Suspense>
        </div>
      </ErrorBoundary>
    </main>
  );
};

export default QuizPage;
