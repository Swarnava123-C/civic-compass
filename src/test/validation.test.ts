import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  sanitizeTextInput,
  clampNumber,
  isValidPercentage,
  isValidPartyName,
  isValidAge,
  createRateLimiter,
} from "@/utils/validation";

describe("escapeHtml", () => {
  it("escapes HTML entities", () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;"
    );
  });

  it("returns empty string for empty input", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("passes through safe text", () => {
    expect(escapeHtml("Hello world")).toBe("Hello world");
  });
});

describe("sanitizeTextInput", () => {
  it("trims whitespace", () => {
    expect(sanitizeTextInput("  hello  ")).toBe("hello");
  });

  it("strips control characters", () => {
    expect(sanitizeTextInput("hello\x00\x01world")).toBe("helloworld");
  });

  it("enforces max length", () => {
    expect(sanitizeTextInput("a".repeat(1000), 100)).toHaveLength(100);
  });
});

describe("clampNumber", () => {
  it("clamps below min", () => {
    expect(clampNumber(-5, 0, 100)).toBe(0);
  });

  it("clamps above max", () => {
    expect(clampNumber(150, 0, 100)).toBe(100);
  });

  it("returns min for NaN", () => {
    expect(clampNumber(NaN, 0, 100)).toBe(0);
  });

  it("passes through valid values", () => {
    expect(clampNumber(50, 0, 100)).toBe(50);
  });
});

describe("isValidPercentage", () => {
  it("accepts 0", () => expect(isValidPercentage(0)).toBe(true));
  it("accepts 100", () => expect(isValidPercentage(100)).toBe(true));
  it("rejects negative", () => expect(isValidPercentage(-1)).toBe(false));
  it("rejects > 100", () => expect(isValidPercentage(101)).toBe(false));
  it("rejects NaN", () => expect(isValidPercentage(NaN)).toBe(false));
  it("rejects Infinity", () => expect(isValidPercentage(Infinity)).toBe(false));
});

describe("isValidPartyName", () => {
  it("accepts normal names", () => expect(isValidPartyName("BJP")).toBe(true));
  it("rejects empty", () => expect(isValidPartyName("")).toBe(false));
  it("rejects script tags", () => expect(isValidPartyName('<script>alert("x")</script>')).toBe(false));
  it("rejects event handlers", () => expect(isValidPartyName('onclick=alert(1)')).toBe(false));
  it("rejects too long", () => expect(isValidPartyName("a".repeat(31))).toBe(false));
});

describe("isValidAge", () => {
  it("accepts 18", () => expect(isValidAge(18)).toBe(true));
  it("rejects 0", () => expect(isValidAge(0)).toBe(false));
  it("rejects 200", () => expect(isValidAge(200)).toBe(false));
  it("rejects float", () => expect(isValidAge(18.5)).toBe(false));
});

describe("createRateLimiter", () => {
  it("allows calls within limit", () => {
    const limiter = createRateLimiter(3, 1000);
    expect(limiter.canProceed()).toBe(true);
    expect(limiter.canProceed()).toBe(true);
    expect(limiter.canProceed()).toBe(true);
  });

  it("blocks calls exceeding limit", () => {
    const limiter = createRateLimiter(2, 1000);
    limiter.canProceed();
    limiter.canProceed();
    expect(limiter.canProceed()).toBe(false);
  });
});
