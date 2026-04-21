import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StateInfoPanel from "@/components/StateInfoPanel";

describe("StateInfoPanel", () => {
  it("renders nothing when no state is selected", () => {
    const { container } = render(<StateInfoPanel selectedState={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows state info when a state is selected", () => {
    render(<StateInfoPanel selectedState={{ name: "California", code: "CA" }} />);
    expect(screen.getByText(/california election info/i)).toBeInTheDocument();
    expect(screen.getByText(/california secretary of state/i)).toBeInTheDocument();
    expect(screen.getByText(/same-day registration/i)).toBeInTheDocument();
  });

  it("shows election authority link", () => {
    render(<StateInfoPanel selectedState={{ name: "Texas", code: "TX" }} />);
    const link = screen.getByText(/texas secretary of state/i);
    expect(link).toHaveAttribute("href");
    expect(link.closest("a")).toHaveAttribute("target", "_blank");
  });
});
