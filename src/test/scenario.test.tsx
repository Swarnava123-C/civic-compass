import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScenarioSimulator from "@/components/ScenarioSimulator";

describe("ScenarioSimulator", () => {
  it("renders the heading and all scenario buttons", () => {
    render(<ScenarioSimulator />);
    expect(screen.getByText(/what happens if i/i)).toBeInTheDocument();
    expect(screen.getByText("I forgot to register")).toBeInTheDocument();
    expect(screen.getByText("I moved to another state")).toBeInTheDocument();
    expect(screen.getByText("I want to vote for the first time")).toBeInTheDocument();
  });

  it("expands scenario on click and shows steps", async () => {
    const user = userEvent.setup();
    render(<ScenarioSimulator />);

    const btn = screen.getByRole("button", { name: /scenario: i forgot to register/i });
    await user.click(btn);

    expect(screen.getByText("Action Steps")).toBeInTheDocument();
    expect(screen.getByText(/check your state's deadline/i)).toBeInTheDocument();
  });

  it("switches to a different scenario", async () => {
    const user = userEvent.setup();
    render(<ScenarioSimulator />);

    await user.click(screen.getByRole("button", { name: /scenario: i forgot to register/i }));
    expect(screen.getByRole("button", { name: /scenario: i forgot to register/i })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: /scenario: i moved to another state/i }));
    expect(screen.getByRole("button", { name: /scenario: i moved to another state/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /scenario: i forgot to register/i })).toHaveAttribute("aria-pressed", "false");
  });

  it("all scenario buttons have aria-pressed attribute", () => {
    render(<ScenarioSimulator />);
    const buttons = screen.getAllByRole("button");
    const scenarioButtons = buttons.filter(b => b.getAttribute("aria-pressed") !== null);
    expect(scenarioButtons.length).toBe(6);
  });
});
