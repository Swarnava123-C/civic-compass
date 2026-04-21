import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScenarioSimulator from "@/components/ScenarioSimulator";

describe("ScenarioSimulator", () => {
  it("renders the heading and scenario buttons", () => {
    render(<ScenarioSimulator />);
    expect(screen.getByText(/what happens if i/i)).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    const scenarioButtons = buttons.filter(b => b.getAttribute("aria-pressed") !== null);
    expect(scenarioButtons.length).toBeGreaterThanOrEqual(3);
  });

  it("expands scenario on click and shows step content", async () => {
    const user = userEvent.setup();
    render(<ScenarioSimulator />);
    const scenarioButtons = screen.getAllByRole("button").filter(b => b.getAttribute("aria-pressed") !== null);
    await user.click(scenarioButtons[0]);
    // expanded scenario shows step details
    expect(screen.getByText(/step 1/i)).toBeInTheDocument();
  });

  it("switches to a different scenario", async () => {
    const user = userEvent.setup();
    render(<ScenarioSimulator />);
    const scenarioButtons = screen.getAllByRole("button").filter(b => b.getAttribute("aria-pressed") !== null);
    await user.click(scenarioButtons[0]);
    expect(scenarioButtons[0]).toHaveAttribute("aria-pressed", "true");
    await user.click(scenarioButtons[1]);
    expect(scenarioButtons[1]).toHaveAttribute("aria-pressed", "true");
    expect(scenarioButtons[0]).toHaveAttribute("aria-pressed", "false");
  });

  it("all scenario buttons have aria-pressed attribute", () => {
    render(<ScenarioSimulator />);
    const buttons = screen.getAllByRole("button");
    const scenarioButtons = buttons.filter(b => b.getAttribute("aria-pressed") !== null);
    expect(scenarioButtons.length).toBeGreaterThanOrEqual(3);
  });
});
