import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GovernmentStructure from "@/components/GovernmentStructure";

describe("GovernmentStructure", () => {
  it("renders heading and all three branches", () => {
    render(<GovernmentStructure />);
    expect(screen.getByText("Government Structure")).toBeInTheDocument();
    expect(screen.getByText(/Executive/)).toBeInTheDocument();
    expect(screen.getByText(/Legislature/)).toBeInTheDocument();
    expect(screen.getByText(/Judiciary/)).toBeInTheDocument();
  });

  it("expands branch on click showing powers and checks", async () => {
    const user = userEvent.setup();
    render(<GovernmentStructure />);

    const buttons = screen.getAllByRole("button");
    const execBtn = buttons.find(b => b.getAttribute("aria-label")?.includes("Executive"));
    expect(execBtn).toBeDefined();
    await user.click(execBtn!);

    expect(screen.getByText("Powers")).toBeInTheDocument();
    expect(screen.getByText("Checks & Balances")).toBeInTheDocument();
  });

  it("branches are keyboard accessible via Enter", async () => {
    const user = userEvent.setup();
    render(<GovernmentStructure />);

    await user.tab();
    const focused = document.activeElement;
    expect(focused?.getAttribute("aria-expanded")).toBe("false");

    await user.keyboard("{Enter}");
    expect(focused?.getAttribute("aria-expanded")).toBe("true");
  });
});
