import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatBox from "@/components/ChatBox";

describe("ChatBox integration", () => {
  it("displays partisan refusal for biased questions", async () => {
    const user = userEvent.setup();
    render(<ChatBox />);

    const input = screen.getByPlaceholderText(/ask about election/i);
    const sendBtn = screen.getByRole("button", { name: /send/i });

    await user.type(input, "Who should I vote for?");
    await user.click(sendBtn);

    expect(
      await screen.findByText(/cannot recommend candidates/i)
    ).toBeInTheDocument();
  });

  it("answers FAQ questions locally without AI call", async () => {
    const user = userEvent.setup();
    render(<ChatBox />);

    const input = screen.getByPlaceholderText(/ask about election/i);
    await user.type(input, "How does voter registration work?");
    await user.click(screen.getByRole("button", { name: /send/i }));

    // Should get a local answer (high confidence)
    expect(await screen.findByText(/high confidence/i)).toBeInTheDocument();
  });

  it("toggles detail level between beginner and detailed", async () => {
    const user = userEvent.setup();
    render(<ChatBox />);

    const beginnerBtn = screen.getByRole("button", { name: /beginner/i });
    const detailedBtn = screen.getByRole("button", { name: /detailed/i });

    expect(beginnerBtn).toHaveAttribute("aria-pressed", "true");
    expect(detailedBtn).toHaveAttribute("aria-pressed", "false");

    await user.click(detailedBtn);
    expect(detailedBtn).toHaveAttribute("aria-pressed", "true");
    expect(beginnerBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("shows disclaimer text", () => {
    render(<ChatBox />);
    expect(screen.getByText(/not an official government source/i)).toBeInTheDocument();
  });
});
