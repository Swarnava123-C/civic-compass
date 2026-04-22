import { describe, it, expect } from "vitest";
import { chunkTextForTTS } from "@/voice/ttsChunker";

describe("chunkTextForTTS", () => {
  it("returns empty array for empty string", () => {
    expect(chunkTextForTTS("", "en")).toEqual([]);
  });

  it("returns single chunk for short text", () => {
    const result = chunkTextForTTS("Hello world.", "en");
    expect(result).toHaveLength(1);
    expect(result[0]).toBe("Hello world");
  });

  it("splits English text by sentences", () => {
    const text = "First sentence. Second sentence! Third question?";
    const result = chunkTextForTTS(text, "en");
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  it("splits Hindi text by purna viram", () => {
    const text = "पहला वाक्य। दूसरा वाक्य। तीसरा वाक्य।";
    const result = chunkTextForTTS(text, "hi");
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  it("splits Bengali text by purna viram", () => {
    const text = "প্রথম বাক্য। দ্বিতীয় বাক্য।";
    const result = chunkTextForTTS(text, "bn");
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it("handles text with markdown symbols", () => {
    const text = "## Heading\n**Bold** text. *Italic* text.";
    const result = chunkTextForTTS(text, "en");
    result.forEach((chunk) => {
      expect(chunk).not.toContain("#");
      expect(chunk).not.toContain("*");
    });
  });

  it("breaks long sentences into sub-chunks", () => {
    const longSentence = "This is a very long sentence, with many comma-separated clauses, that goes on and on, repeating many different things, across multiple phrases, until it becomes really quite long indeed, exceeding the maximum chunk length by a significant margin.";
    const result = chunkTextForTTS(longSentence, "en");
    result.forEach((chunk) => {
      expect(chunk.length).toBeLessThanOrEqual(250); // some tolerance
    });
  });

  it("handles bcp47 codes with region", () => {
    const text = "Hello. World.";
    const result = chunkTextForTTS(text, "en-IN");
    expect(result.length).toBeGreaterThanOrEqual(2);
  });
});
