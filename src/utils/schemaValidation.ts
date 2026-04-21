import type { StructuredAIResponse } from "@/types/civic";

export interface ValidationResult {
  valid: boolean;
  data: StructuredAIResponse | null;
  errors: string[];
}

export function validateStructuredResponse(raw: unknown): ValidationResult {
  const errors: string[] = [];

  if (!raw || typeof raw !== "object") {
    return { valid: false, data: null, errors: ["Response is not an object"] };
  }

  const obj = raw as Record<string, unknown>;

  // Required: summary
  if (typeof obj.summary !== "string" || obj.summary.trim().length === 0) {
    errors.push("Missing or empty 'summary' field");
  }

  // Optional arrays — must be string arrays if present
  for (const key of ["steps", "documents_required", "eligibility_rules", "official_links", "warnings"] as const) {
    if (obj[key] !== undefined && obj[key] !== null) {
      if (!Array.isArray(obj[key])) {
        errors.push(`'${key}' must be an array`);
      } else if (!(obj[key] as unknown[]).every((item) => typeof item === "string")) {
        errors.push(`'${key}' must contain only strings`);
      }
    }
  }

  // Optional strings
  for (const key of ["timeline_stage", "deadlines", "confidence_score"] as const) {
    if (obj[key] !== undefined && obj[key] !== null && typeof obj[key] !== "string") {
      errors.push(`'${key}' must be a string`);
    }
  }

  // Confidence score enum check
  if (typeof obj.confidence_score === "string") {
    const valid = ["high", "medium", "low"];
    if (!valid.includes(obj.confidence_score.toLowerCase())) {
      errors.push(`'confidence_score' must be one of: high, medium, low`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, data: null, errors };
  }

  return {
    valid: true,
    data: {
      summary: obj.summary as string,
      timeline_stage: (obj.timeline_stage as string) || undefined,
      steps: (obj.steps as string[]) || undefined,
      documents_required: (obj.documents_required as string[]) || undefined,
      eligibility_rules: (obj.eligibility_rules as string[]) || undefined,
      deadlines: (obj.deadlines as string) || undefined,
      official_links: (obj.official_links as string[]) || undefined,
      warnings: (obj.warnings as string[]) || undefined,
      confidence_score: (obj.confidence_score as string) || undefined,
    },
    errors: [],
  };
}
