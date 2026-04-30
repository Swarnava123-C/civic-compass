import { z } from "zod";
import type { StructuredAIResponse } from "@/types/civic";

const structuredAIResponseSchema = z.object({
  summary: z.string().min(1, "Summary is required"),
  timeline_stage: z.string().optional(),
  steps: z.array(z.string()).optional(),
  documents_required: z.array(z.string()).optional(),
  eligibility_rules: z.array(z.string()).optional(),
  deadlines: z.string().optional(),
  official_links: z.array(z.string().url("Invalid official link")).optional(),
  warnings: z.array(z.string()).optional(),
  confidence_score: z.enum(["high", "medium", "low"]).optional(),
});

export interface ValidationResult {
  valid: boolean;
  data: StructuredAIResponse | null;
  errors: string[];
}

export function validateStructuredResponse(raw: unknown): ValidationResult {
  const result = structuredAIResponseSchema.safeParse(raw);

  if (!result.success) {
    return {
      valid: false,
      data: null,
      errors: result.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`),
    };
  }

  return {
    valid: true,
    data: result.data as StructuredAIResponse,
    errors: [],
  };
}
