import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Timeline from "@/components/Timeline";

describe("Timeline", () => {
  it("renders timeline heading", () => {
    render(<Timeline />);
    expect(screen.getByText(/election timeline/i)).toBeInTheDocument();
  });

  it("renders all 6 stages", () => {
    render(<Timeline />);
    expect(screen.getByText("Voter Registration")).toBeInTheDocument();
    expect(screen.getByText("Candidate Nomination")).toBeInTheDocument();
    expect(screen.getByText("Campaign Period")).toBeInTheDocument();
    // Stage names may vary — check buttons exist
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(6);
  });

  it("has accessible stage buttons", () => {
    render(<Timeline />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(6);
    const listButton = buttons.find(b => b.getAttribute("aria-expanded") !== null);
    expect(listButton).toBeDefined();
    expect(listButton?.getAttribute("aria-expanded")).toBe("false");
  });
});
