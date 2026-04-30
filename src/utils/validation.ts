/**
 * Centralized input validation utilities.
 * Used across the application for defensive programming.
 */

const HTML_ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

const HTML_ESCAPE_RE = /[&<>"'/]/g;

/** Escape HTML entities to prevent XSS in dynamic content */
export function escapeHtml(str: string): string {
  return str.replace(HTML_ESCAPE_RE, (char) => HTML_ENTITY_MAP[char] || char);
}

/** Sanitize and clamp user text input */
export function sanitizeTextInput(input: string, maxLength = 500): string {
  // eslint-disable-next-line no-control-regex
  return input
    .trim()
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // Remove control characters
    .replace(/[^\w\s\?\!\.\,\-\(\)\u0900-\u097F]/gi, "") // Allow standard punctuation and Devanagari script
    .slice(0, maxLength);
}

/** Validate numeric input is within range */
export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/** Validate percentage is 0-100 */
export function isValidPercentage(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

/** Validate party name - no script injection */
export function isValidPartyName(name: string): boolean {
  if (!name.trim() || name.length > 30) return false;
  // Block obvious script patterns
  if (/<script|javascript:|on\w+=/i.test(name)) return false;
  return true;
}

/** Validate EPIC (Voter ID) number format */
export function isValidEPIC(epic: string): boolean {
  const epicRegex = /^[A-Z]{3}[0-9]{7}$/;
  return epicRegex.test(epic.toUpperCase().trim());
}

/** Validate age input */
export function isValidAge(age: number): boolean {
  return Number.isInteger(age) && age >= 1 && age <= 150;
}

/** Rate limiter for heavy operations */
export function createRateLimiter(maxCalls: number, windowMs: number) {
  const timestamps: number[] = [];
  return {
    canProceed(): boolean {
      const now = Date.now();
      // Remove expired timestamps
      while (timestamps.length > 0 && timestamps[0] < now - windowMs) {
        timestamps.shift();
      }
      if (timestamps.length >= maxCalls) return false;
      timestamps.push(now);
      return true;
    },
  };
}
