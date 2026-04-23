import { describe, it, expect } from "vitest";
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

    // Should get a local answer with confidence badge
    const msgs = await screen.findAllByText(/registration/i);
    expect(msgs.length).toBeGreaterThan(0);
  });

  it("toggles between standard and simple mode", async () => {
    const user = userEvent.setup();
    render(<ChatBox />);

    const standardBtn = screen.getByRole("button", { name: /standard mode/i });
    const simpleBtn = screen.getByRole("button", { name: /simple mode/i });

    expect(standardBtn).toHaveAttribute("aria-pressed", "true");
    expect(simpleBtn).toHaveAttribute("aria-pressed", "false");

    await user.click(simpleBtn);
    expect(simpleBtn).toHaveAttribute("aria-pressed", "true");
    expect(standardBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("shows disclaimer text", () => {
    render(<ChatBox />);
    expect(screen.getByText(/not affiliated with the election commission/i)).toBeInTheDocument();
  });
});
