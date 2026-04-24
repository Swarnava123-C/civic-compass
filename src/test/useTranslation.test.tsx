import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTranslation } from "@/hooks/useTranslation";

describe("useTranslation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns original text when target language is English", async () => {
    const { result } = renderHook(() => useTranslation());
    let out = "";
    await act(async () => {
      out = await result.current.translate("Hello world", "en");
    });
    expect(out).toBe("Hello world");
  });

  it("returns original text for empty input", async () => {
    const { result } = renderHook(() => useTranslation());
    let out = "x";
    await act(async () => {
      out = await result.current.translate("   ", "hi");
    });
    expect(out).toBe("   ");
  });

  it("calls translate endpoint and caches the result", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ translation: "नमस्ते" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useTranslation());

    let first = "";
    await act(async () => {
      first = await result.current.translate("Hello", "hi");
    });
    expect(first).toBe("नमस्ते");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Second call should hit cache, no extra fetch
    let second = "";
    await act(async () => {
      second = await result.current.translate("Hello", "hi");
    });
    expect(second).toBe("नमस्ते");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to original text on network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    const { result } = renderHook(() => useTranslation());
    let out = "";
    await act(async () => {
      out = await result.current.translate("Different text", "bn");
    });
    expect(out).toBe("Different text");
  });

  it("falls back to original text on non-OK response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));
    const { result } = renderHook(() => useTranslation());
    let out = "";
    await act(async () => {
      out = await result.current.translate("Another text", "ta");
    });
    expect(out).toBe("Another text");
  });
});
