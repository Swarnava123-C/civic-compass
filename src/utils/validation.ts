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

/**
 * Escapes HTML special characters in a string to prevent XSS attacks.
 * @param {string} str - The raw string to escape.
 * @returns {string} The HTML-safe escaped string.
 */
export function escapeHtml(str: string): string {
  return str.replace(HTML_ESCAPE_RE, (char) => HTML_ENTITY_MAP[char] || char);
}

/**
 * Sanitizes user-provided text by removing control characters and restricting special characters.
 * Supports Devanagari script for local language compatibility.
 * @param {string} input - The raw text input from the user.
 * @param {number} [maxLength=500] - The maximum allowed length for the sanitized string.
 * @returns {string} The cleaned and clamped text string.
 */
export function sanitizeTextInput(input: string, maxLength = 500): string {
  return input
    .trim()
    /* eslint-disable no-control-regex, no-misleading-character-class */
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // Remove control characters
    .replace(/[^\w\s?!.,\-()\u0900-\u097F]/gi, "") // Allow standard punctuation and Devanagari script
    /* eslint-enable no-control-regex, no-misleading-character-class */
    .slice(0, maxLength);
}

/**
 * Clamps a numeric value between a specified minimum and maximum range.
 * @param {number} value - The input number to clamp.
 * @param {number} min - The lower bound of the range.
 * @param {number} max - The upper bound of the range.
 * @returns {number} The clamped numeric value.
 */
export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/**
 * Validates if a number represents a valid percentage (0 to 100).
 * @param {number} value - The number to check.
 * @returns {boolean} True if the value is a valid percentage.
 */
export function isValidPercentage(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

/**
 * Validates a political party name for length and security (blocking script tags).
 * @param {string} name - The party name to validate.
 * @returns {boolean} True if the name meets length and safety requirements.
 */
export function isValidPartyName(name: string): boolean {
  if (!name.trim() || name.length > 30) return false;
  // Block obvious script patterns
  if (/<script|javascript:|on\w+=/i.test(name)) return false;
  return true;
}

/**
 * Validates the format of an Indian EPIC (Voter ID) number.
 * Standard format: 3 uppercase letters followed by 7 digits.
 * @param {string} epic - The EPIC number string to validate.
 * @returns {boolean} True if the EPIC number matches the official format.
 */
export function isValidEPIC(epic: string): boolean {
  const epicRegex = /^[A-Z]{3}[0-9]{7}$/;
  return epicRegex.test(epic.toUpperCase().trim());
}

/**
 * Validates if a number is a plausible human age (1 to 150).
 * @param {number} age - The age number to validate.
 * @returns {boolean} True if the age is within a reasonable range.
 */
export function isValidAge(age: number): boolean {
  return Number.isInteger(age) && age >= 1 && age <= 150;
}

/**
 * Creates a client-side rate limiter to prevent spam or excessive operations.
 * @param {number} maxCalls - The maximum number of allowed calls within the time window.
 * @param {number} windowMs - The time window duration in milliseconds.
 * @returns {object} An object containing the canProceed() method.
 */
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
