import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders without crashing", async () => {
    render(<App />);
    // App lazy-loads pages, so wait for content
    await waitFor(() => {
      expect(screen.getByText("Loading…")).toBeInTheDocument();
    });
  });
});
