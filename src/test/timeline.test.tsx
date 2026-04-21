import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Timeline from "../components/Timeline";

describe("Timeline", () => {
  it("renders timeline heading", () => {
    render(<Timeline />);
    expect(screen.getByText(/election timeline/i)).toBeInTheDocument();
  });

  it("renders all 6 stages", () => {
    render(<Timeline />);
    expect(screen.getByText("Announcement")).toBeInTheDocument();
    expect(screen.getByText("Nomination")).toBeInTheDocument();
    expect(screen.getByText("Campaign")).toBeInTheDocument();
    expect(screen.getByText("Voting")).toBeInTheDocument();
    expect(screen.getByText("Counting")).toBeInTheDocument();
    expect(screen.getByText("Results")).toBeInTheDocument();
  });

  it("has accessible stage buttons", () => {
    render(<Timeline />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(6);
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("aria-expanded");
    });
  });
});
