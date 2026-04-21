import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Timeline from "@/components/Timeline";
import FAQSection from "@/components/FAQSection";

describe("Timeline keyboard navigation", () => {
  it("timeline stages are focusable via Tab", async () => {
    const user = userEvent.setup();
    render(<Timeline />);

    const stages = screen.getAllByRole("button");
    expect(stages.length).toBeGreaterThan(0);

    // Tab to first stage
    await user.tab();
    expect(stages[0]).toHaveFocus();

    // Tab to second stage
    await user.tab();
    expect(stages[1]).toHaveFocus();
  });

  it("timeline stage expands on Enter key", async () => {
    const user = userEvent.setup();
    render(<Timeline />);

    const stages = screen.getAllByRole("button");
    await user.tab();
    expect(stages[0]).toHaveFocus();
    expect(stages[0]).toHaveAttribute("aria-expanded", "false");

    await user.keyboard("{Enter}");
    expect(stages[0]).toHaveAttribute("aria-expanded", "true");
  });

  it("timeline stage expands on Space key", async () => {
    const user = userEvent.setup();
    render(<Timeline />);

    const stages = screen.getAllByRole("button");
    await user.tab();
    await user.keyboard(" ");
    expect(stages[0]).toHaveAttribute("aria-expanded", "true");
  });

  it("pressing Enter again collapses the stage", async () => {
    const user = userEvent.setup();
    render(<Timeline />);

    const stages = screen.getAllByRole("button");
    await user.tab();
    await user.keyboard("{Enter}");
    expect(stages[0]).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Enter}");
    expect(stages[0]).toHaveAttribute("aria-expanded", "false");
  });
});

describe("FAQ keyboard navigation", () => {
  it("FAQ items are focusable via Tab", async () => {
    const user = userEvent.setup();
    render(<FAQSection />);

    const faqButtons = screen.getAllByRole("button");
    expect(faqButtons.length).toBeGreaterThan(0);

    await user.tab();
    expect(faqButtons[0]).toHaveFocus();
  });

  it("FAQ item toggles on Enter key", async () => {
    const user = userEvent.setup();
    render(<FAQSection />);

    const faqButtons = screen.getAllByRole("button");
    await user.tab();
    expect(faqButtons[0]).toHaveAttribute("aria-expanded", "false");

    await user.keyboard("{Enter}");
    expect(faqButtons[0]).toHaveAttribute("aria-expanded", "true");
  });
});
