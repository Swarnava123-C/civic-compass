import { describe, it, expect, vi } from "vitest";
import { measureInteraction, trackRenderTime } from "@/utils/performance";

describe("performance utils", () => {
  it("measureInteraction executes the function", () => {
    let executed = false;
    measureInteraction("test", () => { executed = true; });
    expect(executed).toBe(true);
  });

  it("trackRenderTime returns a stop function", () => {
    const stop = trackRenderTime("TestComponent");
    expect(typeof stop).toBe("function");
    stop();
  });
});
