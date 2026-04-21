import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StateInfoPanel from "@/components/StateInfoPanel";

describe("StateInfoPanel", () => {
  it("renders nothing when no state is selected", () => {
    const { container } = render(<StateInfoPanel selectedState={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows state info when a state is selected", () => {
    render(<StateInfoPanel selectedState={{ name: "Uttar Pradesh", code: "UP" }} />);
    expect(screen.getAllByText(/uttar pradesh/i).length).toBeGreaterThan(0);
  });

  it("shows election authority link", () => {
    render(<StateInfoPanel selectedState={{ name: "Maharashtra", code: "MH" }} />);
    expect(screen.getByText(/CEO Maharashtra/i)).toBeInTheDocument();
  });
});
