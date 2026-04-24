import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("Skip-to-content link", () => {
  it("renders a skip link targeting #main-content", () => {
    render(<App />);
    const link = screen.getByRole("link", { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("#main-content");
  });
});
