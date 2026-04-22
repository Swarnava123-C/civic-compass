import { describe, it, expect } from "vitest";
import { validateStructuredResponse } from "@/utils/schemaValidation";

describe("validateStructuredResponse", () => {
  it("validates correct response", () => {
    const result = validateStructuredResponse({
      summary: "Test summary",
      confidence_score: "high",
      steps: ["Step 1", "Step 2"],
    });
    expect(result.valid).toBe(true);
    expect(result.data?.summary).toBe("Test summary");
  });

  it("rejects null input", () => {
    expect(validateStructuredResponse(null).valid).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(validateStructuredResponse("string").valid).toBe(false);
  });

  it("rejects missing summary", () => {
    const result = validateStructuredResponse({ confidence_score: "high" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Missing or empty 'summary' field");
  });

  it("rejects non-array steps", () => {
    const result = validateStructuredResponse({ summary: "test", steps: "not array" });
    expect(result.valid).toBe(false);
  });

  it("rejects non-string items in array fields", () => {
    const result = validateStructuredResponse({ summary: "test", steps: [1, 2] });
    expect(result.valid).toBe(false);
  });

  it("validates confidence_score enum", () => {
    const result = validateStructuredResponse({ summary: "test", confidence_score: "invalid" });
    expect(result.valid).toBe(false);
  });

  it("accepts all valid confidence levels", () => {
    for (const level of ["high", "medium", "low"]) {
      const result = validateStructuredResponse({ summary: "test", confidence_score: level });
      expect(result.valid).toBe(true);
    }
  });
});
