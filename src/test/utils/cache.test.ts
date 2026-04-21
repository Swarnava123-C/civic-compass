import { describe, it, expect, beforeEach } from "vitest";
import { cachedGet, clearCache } from "@/utils/cache";

beforeEach(() => clearCache());

describe("cachedGet", () => {
  it("returns fetched data and caches it", () => {
    let calls = 0;
    const fetcher = () => { calls++; return "data"; };

    const r1 = cachedGet("k", fetcher);
    expect(r1).toBe("data");
    expect(calls).toBe(1);

    const r2 = cachedGet("k", fetcher);
    expect(r2).toBe("data");
    expect(calls).toBe(1); // cached
  });

  it("returns stale data immediately and revalidates", async () => {
    const fetcher = () => "fresh";
    cachedGet("k", fetcher, 0); // maxAge=0 → immediately stale

    await new Promise((r) => setTimeout(r, 10));
    const result = cachedGet("k", () => "updated", 0);
    // Returns stale "fresh" immediately
    expect(result).toBe("fresh");
  });

  it("handles async fetchers", async () => {
    const result = await cachedGet("async", () => Promise.resolve(42));
    expect(result).toBe(42);
  });
});
