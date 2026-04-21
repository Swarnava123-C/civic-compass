import { describe, it, expect } from "vitest";
import { INDIA_STATES, type IndiaStateElectionData, NATIONAL_AVERAGE_TURNOUT, TOTAL_LOK_SABHA_SEATS } from "@/data/indiaElectionData";
import { HISTORICAL_DATA, type StateHistoricalData } from "@/data/historicalData";

describe("India Election Data Schema Validation", () => {
  it("should have at least 36 entries (28 states + 8 UTs)", () => {
    expect(INDIA_STATES.length).toBeGreaterThanOrEqual(36);
  });

  it("every entry has required string fields", () => {
    for (const s of INDIA_STATES) {
      expect(typeof s.code).toBe("string");
      expect(s.code.length).toBeGreaterThanOrEqual(2);
      expect(typeof s.name).toBe("string");
      expect(s.name.length).toBeGreaterThan(0);
      expect(typeof s.electionAuthority).toBe("string");
      expect(typeof s.electionAuthorityUrl).toBe("string");
      expect(typeof s.registrationPortal).toBe("string");
      expect(typeof s.notes).toBe("string");
      expect(typeof s.upcomingElection).toBe("string");
      expect(typeof s.leadingParty).toBe("string");
    }
  });

  it("every entry has valid type", () => {
    for (const s of INDIA_STATES) {
      expect(["state", "ut"]).toContain(s.type);
    }
  });

  it("voter turnout is between 0 and 100", () => {
    for (const s of INDIA_STATES) {
      expect(s.voterTurnout).toBeGreaterThan(0);
      expect(s.voterTurnout).toBeLessThanOrEqual(100);
    }
  });

  it("total constituencies is a positive integer", () => {
    for (const s of INDIA_STATES) {
      expect(Number.isInteger(s.totalConstituencies)).toBe(true);
      expect(s.totalConstituencies).toBeGreaterThan(0);
    }
  });

  it("total votes cast is a positive number", () => {
    for (const s of INDIA_STATES) {
      expect(s.totalVotesCast).toBeGreaterThan(0);
    }
  });

  it("voting age is 18", () => {
    for (const s of INDIA_STATES) {
      expect(s.votingAge).toBe(18);
    }
  });

  it("last election year is reasonable", () => {
    for (const s of INDIA_STATES) {
      expect(s.lastElectionYear).toBeGreaterThanOrEqual(2010);
      expect(s.lastElectionYear).toBeLessThanOrEqual(2030);
    }
  });

  it("vote share adds up to approximately 100%", () => {
    for (const s of INDIA_STATES) {
      expect(s.voteShare.length).toBeGreaterThan(0);
      const total = s.voteShare.reduce((acc, v) => acc + v.percentage, 0);
      expect(total).toBeGreaterThan(95);
      expect(total).toBeLessThanOrEqual(101);
    }
  });

  it("national constants are valid", () => {
    expect(NATIONAL_AVERAGE_TURNOUT).toBeGreaterThan(50);
    expect(NATIONAL_AVERAGE_TURNOUT).toBeLessThan(80);
    expect(TOTAL_LOK_SABHA_SEATS).toBe(543);
  });

  it("all state codes are unique", () => {
    const codes = INDIA_STATES.map((s) => s.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe("Historical Data Schema", () => {
  it("each entry has valid stateCode and stateName", () => {
    for (const d of HISTORICAL_DATA) {
      expect(typeof d.stateCode).toBe("string");
      expect(typeof d.stateName).toBe("string");
      expect(d.elections.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("election years are in ascending order", () => {
    for (const d of HISTORICAL_DATA) {
      for (let i = 1; i < d.elections.length; i++) {
        expect(d.elections[i].year).toBeGreaterThan(d.elections[i - 1].year);
      }
    }
  });

  it("turnout percentages are valid", () => {
    for (const d of HISTORICAL_DATA) {
      for (const e of d.elections) {
        expect(e.turnoutPercent).toBeGreaterThan(0);
        expect(e.turnoutPercent).toBeLessThanOrEqual(100);
      }
    }
  });

  it("seats add up correctly (topParty + opposition <= total)", () => {
    for (const d of HISTORICAL_DATA) {
      for (const e of d.elections) {
        expect(e.topPartySeats + e.majorOppositionSeats).toBeLessThanOrEqual(e.totalSeats);
        expect(e.totalSeats).toBeGreaterThan(0);
      }
    }
  });
});
