import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GovernmentStructure from "@/components/GovernmentStructure";

describe("GovernmentStructure", () => {
  it("renders heading and all three branches", () => {
    render(<GovernmentStructure />);
    expect(screen.getByText("Government Structure")).toBeInTheDocument();
    expect(screen.getByText("Executive Branch")).toBeInTheDocument();
    expect(screen.getByText("Legislative Branch")).toBeInTheDocument();
    expect(screen.getByText("Judicial Branch")).toBeInTheDocument();
  });

  it("expands branch on click showing powers and checks", async () => {
    const user = userEvent.setup();
    render(<GovernmentStructure />);

    const execBtn = screen.getByRole("button", { name: /executive branch/i });
    await user.click(execBtn);

    expect(screen.getByText("Powers")).toBeInTheDocument();
    expect(screen.getByText("Checks & Balances")).toBeInTheDocument();
    expect(screen.getByText(/signs or vetoes legislation/i)).toBeInTheDocument();
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
