import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StructuredResponse from "@/components/StructuredResponse";
import type { StructuredAIResponse } from "@/types/civic";

describe("StructuredResponse", () => {
  const fullData: StructuredAIResponse = {
    summary: "You need to register before the deadline.",
    timeline_stage: "Registration",
    steps: ["Check eligibility", "Register online", "Verify registration"],
    documents_required: ["Photo ID", "Proof of address"],
    eligibility_rules: ["Must be 18+", "Must be a citizen"],
    deadlines: "30 days before Election Day",
    official_links: ["https://vote.gov"],
    warnings: ["Don't miss the deadline"],
    confidence_score: "high",
  };

  it("renders summary", () => {
    render(<StructuredResponse data={fullData} />);
    expect(screen.getByText(/you need to register/i)).toBeInTheDocument();
  });

  it("renders steps as ordered list", () => {
    render(<StructuredResponse data={fullData} />);
    expect(screen.getByText("Check eligibility")).toBeInTheDocument();
    expect(screen.getByText("Register online")).toBeInTheDocument();
  });

  it("renders documents, eligibility, deadlines", () => {
    render(<StructuredResponse data={fullData} />);
    expect(screen.getByText("Photo ID")).toBeInTheDocument();
    expect(screen.getByText("Must be 18+")).toBeInTheDocument();
    expect(screen.getByText(/30 days/i)).toBeInTheDocument();
  });

  it("renders warnings", () => {
    render(<StructuredResponse data={fullData} />);
    expect(screen.getByText(/don't miss the deadline/i)).toBeInTheDocument();
  });

  it("renders confidence badge", () => {
    render(<StructuredResponse data={fullData} />);
    expect(screen.getByText(/high confidence/i)).toBeInTheDocument();
  });

  it("renders minimal data without crashing", () => {
    render(<StructuredResponse data={{ summary: "Brief answer.", confidence_score: "low" }} />);
    expect(screen.getByText("Brief answer.")).toBeInTheDocument();
    expect(screen.getByText(/low confidence/i)).toBeInTheDocument();
  });
});
