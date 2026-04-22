import { describe, it, expect } from "vitest";
import { computeConfidenceBreakdown } from "@/utils/confidenceEngine";

describe("computeConfidenceBreakdown", () => {
  it("returns high for state + process query", () => {
    const result = computeConfidenceBreakdown("How do I register to vote in Tamil Nadu?");
    expect(result.level).toBe("high");
    expect(result.hasState).toBe(true);
    expect(result.hasProcess).toBe(true);
  });

  it("returns high when profile has state and query has process", () => {
    const result = computeConfidenceBreakdown("How do I register?", {
      state: { name: "Kerala", code: "KL" },
      age: 21,
      needsRegistrationHelp: false,
      needsIdHelp: false,
    });
    expect(result.level).toBe("high");
  });

  it("returns medium for process-only query", () => {
    const result = computeConfidenceBreakdown("What is EVM?");
    expect(result.level).toBe("medium");
    expect(result.hasProcess).toBe(true);
  });

  it("returns low for vague query", () => {
    const result = computeConfidenceBreakdown("Tell me about democracy");
    expect(result.level).toBe("low");
  });

  it("includes helpful reasons", () => {
    const result = computeConfidenceBreakdown("hello");
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});
