import { memo, useMemo } from "react";
import type { StateInfo, StateDetail } from "@/types/civic";
import { STATE_DETAILS } from "@/data/stateDetails";

interface StateInfoPanelProps {
  selectedState: StateInfo | null;
}

const StateInfoPanel = memo(function StateInfoPanel({ selectedState }: StateInfoPanelProps) {
  const details: StateDetail | null = useMemo(() => {
    if (!selectedState) return null;
    return STATE_DETAILS[selectedState.code] ?? null;
  }, [selectedState]);

  if (!selectedState || !details) return null;

  return (
    <section className="py-8 px-4" aria-labelledby="state-info-heading">
      <div className="container max-w-4xl mx-auto">
        <div className="civic-card p-6">
          <h2 id="state-info-heading" className="text-xl font-bold text-foreground font-sans mb-4 flex items-center gap-2">
            <span aria-hidden="true">📍</span> {selectedState.name} Election Info
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs font-semibold text-muted-foreground font-sans mb-1">Election Authority</p>
              <a
                href={details.electionAuthorityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline font-sans focus:outline-none focus:ring-2 focus:ring-ring rounded"
                aria-label={`Visit ${details.electionAuthority} website (opens in new tab)`}
              >
                {details.electionAuthority}
              </a>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs font-semibold text-muted-foreground font-sans mb-1">Registration Portal</p>
              {details.registrationPortal.startsWith("http") ? (
                <a
                  href={details.registrationPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline font-sans focus:outline-none focus:ring-2 focus:ring-ring rounded"
                  aria-label="Visit registration portal (opens in new tab)"
                >
                  Register Online →
                </a>
              ) : (
                <p className="text-sm text-foreground font-sans">{details.registrationPortal}</p>
              )}
            </div>

            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs font-semibold text-muted-foreground font-sans mb-1">Voting Age</p>
              <p className="text-sm text-foreground font-sans">{details.votingAge} years old</p>
            </div>

            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs font-semibold text-muted-foreground font-sans mb-1">Next Election</p>
              <p className="text-sm text-foreground font-sans">{details.nextElection}</p>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 sm:col-span-2">
              <p className="text-xs font-semibold text-muted-foreground font-sans mb-1">State Notes</p>
              <p className="text-sm text-foreground font-sans">{details.notes}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default StateInfoPanel;
