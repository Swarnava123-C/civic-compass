import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatBox from "../components/ChatBox";

describe("ChatBox", () => {
  it("renders input box", () => {
    render(<ChatBox />);
    expect(screen.getByPlaceholderText(/ask about elections/i)).toBeInTheDocument();
  });

  it("renders send button", () => {
    render(<ChatBox />);
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("renders mode toggles", () => {
    render(<ChatBox />);
    expect(screen.getByRole("button", { name: /standard mode/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /simple mode/i })).toBeInTheDocument();
  });

  it("renders disclaimer", () => {
    render(<ChatBox />);
    expect(screen.getByText(/not affiliated with the election commission/i)).toBeInTheDocument();
  });
});
