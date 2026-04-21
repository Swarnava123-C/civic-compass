import type { StateDetail } from "@/types/civic";
import { INDIA_STATES } from "./indiaElectionData";

export const STATE_DETAILS: Record<string, StateDetail> = Object.fromEntries(
  INDIA_STATES.map((s) => [
    s.code,
    {
      code: s.code,
      electionAuthority: s.electionAuthority,
      electionAuthorityUrl: s.electionAuthorityUrl,
      registrationPortal: s.registrationPortal,
      votingAge: s.votingAge,
      nextElection: s.upcomingElection,
      notes: s.notes,
    },
  ])
);
