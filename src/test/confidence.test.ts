import { describe, it, expect } from "vitest";

// Test the confidence engine logic
function computeConfidence(input: string): "high" | "medium" | "low" {
  const statePattern = /\b(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)\b/i;
  const processPattern = /\b(register|registration|vote|voting|ballot|polling|absentee|primary|election|campaign|count|recount|certif)\b/i;

  const hasState = statePattern.test(input);
  const hasProcess = processPattern.test(input);

  if (hasState && hasProcess) return "high";
  if (hasProcess) return "medium";
  return "low";
}

describe("Confidence Engine", () => {
  it("returns high for state + process query", () => {
    expect(computeConfidence("How do I register to vote in California?")).toBe("high");
    expect(computeConfidence("Texas voting requirements")).toBe("high");
    expect(computeConfidence("New York absentee ballot")).toBe("high");
  });

  it("returns medium for process-only query", () => {
    expect(computeConfidence("How does voter registration work?")).toBe("medium");
    expect(computeConfidence("When is election day?")).toBe("medium");
    expect(computeConfidence("What is a primary election?")).toBe("medium");
  });

  it("returns low for vague queries", () => {
    expect(computeConfidence("Tell me about democracy")).toBe("low");
    expect(computeConfidence("What is government?")).toBe("low");
    expect(computeConfidence("Hello")).toBe("low");
  });
});
