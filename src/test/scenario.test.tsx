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

  it("collapses scenario on second click", async () => {
    const user = userEvent.setup();
    render(<ScenarioSimulator />);

    const btn = screen.getByRole("button", { name: /scenario: i forgot to register/i });
    await user.click(btn);
    expect(screen.getByText("Action Steps")).toBeInTheDocument();

    await user.click(btn);
    expect(screen.queryByText("Action Steps")).not.toBeInTheDocument();
  });

  it("scenario buttons are keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<ScenarioSimulator />);

    await user.tab();
    const focused = document.activeElement;
    expect(focused?.getAttribute("role")).toBe("button");
  });
});
