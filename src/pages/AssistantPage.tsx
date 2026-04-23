import { lazy, Suspense } from "react";
import StickyNav from "@/components/StickyNav";
import ErrorBoundary from "@/components/ErrorBoundary";

const ChatBox = lazy(() => import("@/components/ChatBox"));

function LoadingSkeleton() {
  return (
    <div className="py-16 px-4" aria-busy="true">
      <div className="container max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mx-auto" />
        <div className="h-96 bg-muted animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}

const AssistantPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary>
        <StickyNav />
        <div className="pt-4">
          <Suspense fallback={<LoadingSkeleton />}>
            <ChatBox profile={null} selectedState={null} />
          </Suspense>
        </div>
      </ErrorBoundary>
    </main>
  );
};

export default AssistantPage;
