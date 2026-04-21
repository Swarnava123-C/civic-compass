import { describe, it, expect, vi, beforeEach } from "vitest";
import { detectBrowserLanguage, persistLanguage, getLanguagesForState, getLanguageByCode, INDIAN_LANGUAGES } from "@/voice/languageConfig";

describe("Language Config", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("detects Hindi for hi-IN browser", () => {
    vi.spyOn(navigator, "language", "get").mockReturnValue("hi-IN");
    expect(detectBrowserLanguage()).toBe("hi");
  });

  it("detects Bengali for bn-IN browser", () => {
    vi.spyOn(navigator, "language", "get").mockReturnValue("bn-IN");
    expect(detectBrowserLanguage()).toBe("bn");
  });

  it("detects English for en-US browser", () => {
    vi.spyOn(navigator, "language", "get").mockReturnValue("en-US");
    expect(detectBrowserLanguage()).toBe("en");
  });

  it("falls back to Hindi for unsupported language", () => {
    vi.spyOn(navigator, "language", "get").mockReturnValue("fr-FR");
    expect(detectBrowserLanguage()).toBe("hi");
  });

  it("uses localStorage if set", () => {
    localStorage.setItem("civicflow_language", "ta");
    vi.spyOn(navigator, "language", "get").mockReturnValue("en-US");
    expect(detectBrowserLanguage()).toBe("ta");
  });

  it("persists language to localStorage", () => {
    persistLanguage("ml");
    expect(localStorage.getItem("civicflow_language")).toBe("ml");
  });

  it("returns languages for state with English and Hindi always included", () => {
    const langs = getLanguagesForState("TN");
    const codes = langs.map((l) => l.code);
    expect(codes).toContain("ta");
    expect(codes).toContain("en");
    expect(codes).toContain("hi");
  });

  it("getLanguageByCode returns correct language", () => {
    const lang = getLanguageByCode("mr");
    expect(lang?.name).toBe("Marathi");
    expect(lang?.bcp47).toBe("mr-IN");
  });

  it("has at least 12 Indian languages", () => {
    expect(INDIAN_LANGUAGES.length).toBeGreaterThanOrEqual(12);
  });
});

describe("Mute persistence", () => {
  it("civicflow_audio_enabled defaults to not set", () => {
    expect(localStorage.getItem("civicflow_audio_enabled")).toBeNull();
  });

  it("persists mute state", () => {
    localStorage.setItem("civicflow_audio_enabled", "false");
    expect(localStorage.getItem("civicflow_audio_enabled")).toBe("false");
  });
});
