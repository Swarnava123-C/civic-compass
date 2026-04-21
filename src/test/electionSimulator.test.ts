import { describe, it, expect } from "vitest";
import { validateVoteShares, simulateElection, type PartyInput } from "@/utils/electionSimulator";

describe("validateVoteShares", () => {
  it("passes valid input", () => {
    const parties: PartyInput[] = [
      { name: "A", voteSharePercent: 60 },
      { name: "B", voteSharePercent: 40 },
    ];
    expect(validateVoteShares(parties)).toHaveLength(0);
  });

  it("rejects fewer than 2 parties", () => {
    const errors = validateVoteShares([{ name: "A", voteSharePercent: 100 }]);
    expect(errors.some((e) => e.message.includes("2 parties"))).toBe(true);
  });

  it("rejects more than 6 parties", () => {
    const parties = Array.from({ length: 7 }, (_, i) => ({ name: `P${i}`, voteSharePercent: 14.28 }));
    expect(validateVoteShares(parties).some((e) => e.message.includes("6 parties"))).toBe(true);
  });

  it("rejects vote shares not summing to 100", () => {
    const parties: PartyInput[] = [
      { name: "A", voteSharePercent: 50 },
      { name: "B", voteSharePercent: 30 },
    ];
    expect(validateVoteShares(parties).some((e) => e.field === "voteShare")).toBe(true);
  });

  it("rejects empty party names", () => {
    const parties: PartyInput[] = [
      { name: "", voteSharePercent: 50 },
      { name: "B", voteSharePercent: 50 },
    ];
    expect(validateVoteShares(parties).some((e) => e.field === "partyName")).toBe(true);
  });
});

describe("simulateElection", () => {
  it("allocates seats summing to total", () => {
    const result = simulateElection(100, [
      { name: "A", voteSharePercent: 55 },
      { name: "B", voteSharePercent: 45 },
    ]);
    const totalAllocated = result.partySeats.reduce((s, p) => s + p.seats, 0);
    expect(totalAllocated).toBe(100);
  });

  it("detects outright majority", () => {
    const result = simulateElection(200, [
      { name: "A", voteSharePercent: 60 },
      { name: "B", voteSharePercent: 40 },
    ]);
    expect(result.hasOutrightMajority).toBe(true);
    expect(result.majorityParty).toBe("A");
    expect(result.isHungAssembly).toBe(false);
  });

  it("detects hung assembly with close vote shares", () => {
    const result = simulateElection(100, [
      { name: "A", voteSharePercent: 34 },
      { name: "B", voteSharePercent: 33 },
      { name: "C", voteSharePercent: 33 },
    ]);
    expect(result.majorityMark).toBe(51);
    // With 3 nearly-equal parties, no single party gets majority
    expect(result.isHungAssembly).toBe(true);
    expect(result.coalitionSuggestion).toBeTruthy();
  });

  it("applies swing adjustment", () => {
    const noSwing = simulateElection(100, [
      { name: "A", voteSharePercent: 50 },
      { name: "B", voteSharePercent: 50 },
    ]);
    const withSwing = simulateElection(100, [
      { name: "A", voteSharePercent: 50 },
      { name: "B", voteSharePercent: 50 },
    ], 10);
    const seatsA_noSwing = noSwing.partySeats.find((p) => p.name === "A")?.seats ?? 0;
    const seatsA_withSwing = withSwing.partySeats.find((p) => p.name === "A")?.seats ?? 0;
    expect(seatsA_withSwing).toBeGreaterThan(seatsA_noSwing);
  });

  it("calculates correct majority mark", () => {
    const result = simulateElection(403, [
      { name: "A", voteSharePercent: 60 },
      { name: "B", voteSharePercent: 40 },
    ]);
    expect(result.majorityMark).toBe(202);
  });
});
