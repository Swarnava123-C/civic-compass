/**
 * Google Analytics 4 — consent-safe event tracking service.
 *
 * Events are only dispatched when:
 *  1. A GA4 Measurement ID is configured (`VITE_GA4_MEASUREMENT_ID`)
 *  2. The user has not opted out (respects `civicflow_analytics_consent`)
 *
 * All calls are fire-and-forget with no side-effects on the UI.
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AnalyticsEvent {
  /** GA4 event name — snake_case, max 40 chars */
  name: string;
  /** Optional key–value params (values must be primitives) */
  params?: Record<string, string | number | boolean>;
}

type GtagArgs = [string, ...unknown[]];
type Gtag = (...args: GtagArgs) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CONSENT_KEY = "civicflow_analytics_consent";
function getGaId(): string | undefined {
  return import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;
}

/* ------------------------------------------------------------------ */
/*  Consent helpers                                                    */
/* ------------------------------------------------------------------ */

export function hasAnalyticsConsent(): boolean {
  return localStorage.getItem(CONSENT_KEY) !== "denied";
}

export function setAnalyticsConsent(granted: boolean): void {
  localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  if (window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }
}

/* ------------------------------------------------------------------ */
/*  Initialisation (called once in main.tsx)                           */
/* ------------------------------------------------------------------ */

let initialised = false;

export function initAnalytics(): void {
  const gaId = getGaId();
  if (initialised || !gaId) return;
  initialised = true;

  // Default consent — denied until user accepts
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: GtagArgs) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("consent", "default", {
    analytics_storage: hasAnalyticsConsent() ? "granted" : "denied",
  });
  window.gtag("config", gaId, {
    send_page_view: true,
    anonymize_ip: true,
  });

  // Load gtag.js script asynchronously
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);
}

/* ------------------------------------------------------------------ */
/*  Event tracking                                                     */
/* ------------------------------------------------------------------ */

function send(event: AnalyticsEvent): void {
  const gaId = getGaId();
  if (!gaId || !window.gtag || !hasAnalyticsConsent()) return;
  window.gtag("event", event.name, event.params);
}

/* ------------------------------------------------------------------ */
/*  Predefined CivicFlow events                                        */
/* ------------------------------------------------------------------ */

/** User selects a state on the India map */
export function trackStateSelection(stateCode: string, stateName: string): void {
  send({ name: "state_selection", params: { state_code: stateCode, state_name: stateName } });
}

/** User runs the election simulator */
export function trackSimulatorRun(stateCode: string, totalSeats: number): void {
  send({ name: "simulator_run", params: { state_code: stateCode, total_seats: totalSeats } });
}

/** User completes the civic quiz */
export function trackQuizComplete(score: number, total: number): void {
  send({ name: "quiz_complete", params: { score, total, percentage: Math.round((score / total) * 100) } });
}

/** User clicks a timeline stage */
export function trackTimelineInteraction(stageIndex: number, stageName: string): void {
  send({ name: "timeline_interaction", params: { stage_index: stageIndex, stage_name: stageName } });
}

/** User toggles voice mode */
export function trackVoiceToggle(mode: string): void {
  send({ name: "voice_toggle", params: { voice_mode: mode } });
}

/** User changes language */
export function trackLanguageChange(languageCode: string): void {
  send({ name: "language_change", params: { language_code: languageCode } });
}

/** User sends a chat message */
export function trackChatMessage(detailLevel: string, hasImage: boolean = false): void {
  send({ name: "chat_message", params: { detail_level: detailLevel, has_image: hasImage } });
}

/** User uploads a document for analysis */
export function trackDocumentUpload(fileType: string): void {
  send({ name: "document_upload", params: { file_type: fileType } });
}

/** User toggles accessibility theme */
export function trackThemeToggle(theme: string): void {
  send({ name: "theme_toggle", params: { theme_name: theme } });
}

/** Page view for SPA route changes */
export function trackPageView(path: string): void {
  const gaId = getGaId();
  if (!gaId || !window.gtag) return;
  window.gtag("config", gaId, { page_path: path });
}
