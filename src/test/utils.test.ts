import { describe, it, expect } from "vitest";
import { formatDate, sanitizeInput } from "../utils/date";

describe("formatDate", () => {
  it("formats date correctly", () => {
    const result = formatDate("2026-04-20");
    expect(result).toContain("2026");
  });

  it("handles ISO date strings", () => {
    const result = formatDate("2026-01-15T00:00:00Z");
    expect(result).toContain("January");
  });
});

describe("sanitizeInput", () => {
  it("trims whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello");
  });

  it("truncates to 500 chars", () => {
    const longStr = "a".repeat(600);
    expect(sanitizeInput(longStr).length).toBe(500);
  });

  it("handles empty string", () => {
    expect(sanitizeInput("")).toBe("");
  });
});
