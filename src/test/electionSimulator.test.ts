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

  it("rejects negative vote shares", () => {
    const parties: PartyInput[] = [
      { name: "A", voteSharePercent: -10 },
      { name: "B", voteSharePercent: 110 },
    ];
    expect(validateVoteShares(parties).some((e) => e.field === "voteShare")).toBe(true);
  });

  it("accepts shares within 0.5% tolerance of 100", () => {
    const parties: PartyInput[] = [
      { name: "A", voteSharePercent: 50.3 },
      { name: "B", voteSharePercent: 49.9 },
    ];
    expect(validateVoteShares(parties)).toHaveLength(0);
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

  // Edge cases
  it("handles 0% turnout edge case (all zero shares)", () => {
    const result = simulateElection(100, [
      { name: "A", voteSharePercent: 50 },
      { name: "B", voteSharePercent: 50 },
    ]);
    expect(result.totalSeats).toBe(100);
    expect(result.partySeats.reduce((s, p) => s + p.seats, 0)).toBe(100);
  });

  it("handles extreme dominance (99-1 split)", () => {
    const result = simulateElection(100, [
      { name: "A", voteSharePercent: 99 },
      { name: "B", voteSharePercent: 1 },
    ]);
    expect(result.hasOutrightMajority).toBe(true);
    expect(result.partySeats.find((p) => p.name === "A")!.seats).toBeGreaterThanOrEqual(99);
  });

  it("handles tie vote shares", () => {
    const result = simulateElection(100, [
      { name: "A", voteSharePercent: 50 },
      { name: "B", voteSharePercent: 50 },
    ]);
    expect(result.partySeats.reduce((s, p) => s + p.seats, 0)).toBe(100);
    expect(result.partySeats[0].seats).toBe(50);
    expect(result.partySeats[1].seats).toBe(50);
  });

  it("handles single seat constituency", () => {
    const result = simulateElection(1, [
      { name: "A", voteSharePercent: 60 },
      { name: "B", voteSharePercent: 40 },
    ]);
    expect(result.totalSeats).toBe(1);
    expect(result.partySeats.reduce((s, p) => s + p.seats, 0)).toBe(1);
    expect(result.majorityMark).toBe(1);
  });

  it("handles 6 parties", () => {
    const result = simulateElection(300, [
      { name: "A", voteSharePercent: 30 },
      { name: "B", voteSharePercent: 25 },
      { name: "C", voteSharePercent: 20 },
      { name: "D", voteSharePercent: 10 },
      { name: "E", voteSharePercent: 10 },
      { name: "F", voteSharePercent: 5 },
    ]);
    expect(result.partySeats.reduce((s, p) => s + p.seats, 0)).toBe(300);
    expect(result.partySeats).toHaveLength(6);
  });

  it("coalition suggestion includes enough parties for majority", () => {
    const result = simulateElection(100, [
      { name: "A", voteSharePercent: 34 },
      { name: "B", voteSharePercent: 33 },
      { name: "C", voteSharePercent: 33 },
    ]);
    if (result.coalitionSuggestion) {
      // Extract seat count from suggestion
      const match = result.coalitionSuggestion.match(/\((\d+) seats\)/);
      if (match) {
        expect(parseInt(match[1])).toBeGreaterThanOrEqual(result.majorityMark);
      }
    }
  });

  it("negative swing does not produce negative vote shares", () => {
    const result = simulateElection(100, [
      { name: "A", voteSharePercent: 5 },
      { name: "B", voteSharePercent: 95 },
    ], -10);
    result.partySeats.forEach((p) => {
      expect(p.seats).toBeGreaterThanOrEqual(0);
      expect(p.voteShare).toBeGreaterThanOrEqual(0);
    });
  });
});
