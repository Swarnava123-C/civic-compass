import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  hasAnalyticsConsent,
  setAnalyticsConsent,
  trackStateSelection,
  trackSimulatorRun,
  trackQuizComplete,
  trackTimelineInteraction,
  trackVoiceToggle,
  trackLanguageChange,
  trackChatMessage,
} from "@/utils/analytics";

describe("Analytics Service", () => {
  beforeEach(() => {
    localStorage.clear();
    window.gtag = undefined;
    window.dataLayer = undefined;
  });

  describe("Consent", () => {
    it("defaults to granted when no localStorage entry", () => {
      expect(hasAnalyticsConsent()).toBe(true);
    });

    it("returns false when denied", () => {
      setAnalyticsConsent(false);
      expect(hasAnalyticsConsent()).toBe(false);
      expect(localStorage.getItem("civicflow_analytics_consent")).toBe("denied");
    });

    it("returns true when granted", () => {
      setAnalyticsConsent(true);
      expect(hasAnalyticsConsent()).toBe(true);
      expect(localStorage.getItem("civicflow_analytics_consent")).toBe("granted");
    });

    it("calls gtag consent update if gtag exists", () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;
      setAnalyticsConsent(true);
      expect(mockGtag).toHaveBeenCalledWith("consent", "update", {
        analytics_storage: "granted",
      });
    });
  });

  describe("Event tracking", () => {
    it("does not throw when gtag is not loaded", () => {
      expect(() => trackStateSelection("MH", "Maharashtra")).not.toThrow();
      expect(() => trackSimulatorRun("KA", 224)).not.toThrow();
      expect(() => trackQuizComplete(4, 5)).not.toThrow();
      expect(() => trackTimelineInteraction(0, "Registration")).not.toThrow();
      expect(() => trackVoiceToggle("both")).not.toThrow();
      expect(() => trackLanguageChange("hi")).not.toThrow();
      expect(() => trackChatMessage("beginner")).not.toThrow();
    });

    it("sends events when gtag is available and consent granted", () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;
      setAnalyticsConsent(true);

      trackStateSelection("TN", "Tamil Nadu");
      expect(mockGtag).toHaveBeenCalledWith("event", "state_selection", {
        state_code: "TN",
        state_name: "Tamil Nadu",
      });
    });

    it("does not send events when consent denied", () => {
      const mockGtag = vi.fn();
      window.gtag = mockGtag;
      setAnalyticsConsent(false);

      trackSimulatorRun("UP", 403);
      // Only the consent update call, no event call
      const eventCalls = mockGtag.mock.calls.filter((c) => c[0] === "event");
      expect(eventCalls.length).toBe(0);
    });
  });
});
