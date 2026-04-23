import { describe, it, expect } from "vitest";
import { logger } from "@/utils/logger";

describe("logger", () => {
  it("has info, warn, error, debug methods", () => {
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });

  it("does not throw when called", () => {
    expect(() => logger.info("test message")).not.toThrow();
    expect(() => logger.error("test error", { code: 500 })).not.toThrow();
  });
});
