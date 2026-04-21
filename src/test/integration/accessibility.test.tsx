import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import Timeline from "@/components/Timeline";
import FAQSection from "@/components/FAQSection";
import ChatBox from "@/components/ChatBox";

async function runAxe(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      region: { enabled: false }, // components are sections, not full pages
    },
  });
  return results.violations;
}

describe("Automated accessibility audit (axe-core)", () => {
  it("Timeline has no accessibility violations", async () => {
    const { container } = render(<Timeline />);
    const violations = await runAxe(container);
    expect(violations).toEqual([]);
  });

  it("FAQ section has no accessibility violations", async () => {
    const { container } = render(<FAQSection />);
    const violations = await runAxe(container);
    expect(violations).toEqual([]);
  });

  it("ChatBox has no accessibility violations", async () => {
    const { container } = render(<ChatBox />);
    const violations = await runAxe(container);
    expect(violations).toEqual([]);
  });
});
