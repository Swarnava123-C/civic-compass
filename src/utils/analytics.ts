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

/**
 * Checks if the user has granted consent for analytics tracking.
 * @returns {boolean} True if consent is not explicitly denied.
 */
export function hasAnalyticsConsent(): boolean {
  return localStorage.getItem(CONSENT_KEY) !== "denied";
}

/**
 * Updates the user's analytics consent and notifies GA4.
 * @param {boolean} granted - Whether consent was granted.
 */
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

/**
 * Initializes Google Analytics 4 tracking.
 * Loads the gtag.js script and sets default consent and config.
 */
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

/**
 * Internal helper to send events to GA4.
 * @param {AnalyticsEvent} event - The event object to send.
 */
function send(event: AnalyticsEvent): void {
  const gaId = getGaId();
  if (!gaId || !window.gtag || !hasAnalyticsConsent()) return;
  window.gtag("event", event.name, event.params);
}

/* ------------------------------------------------------------------ */
/*  Predefined CivicFlow events                                        */
/* ------------------------------------------------------------------ */

/**
 * Tracks when a user selects a state on the interactive map.
 * @param {string} stateCode - The code of the selected state.
 * @param {string} stateName - The name of the selected state.
 */
export function trackStateSelection(stateCode: string, stateName: string): void {
  send({ name: "state_selection", params: { state_code: stateCode, state_name: stateName } });
}

/**
 * Tracks when a user executes an election simulation.
 * @param {string} stateCode - The code of the state being simulated.
 * @param {number} totalSeats - The number of seats in the simulation.
 */
export function trackSimulatorRun(stateCode: string, totalSeats: number): void {
  send({ name: "simulator_run", params: { state_code: stateCode, total_seats: totalSeats } });
}

/**
 * Tracks when a user completes a civic knowledge quiz.
 * @param {number} score - The user's score.
 * @param {number} total - The total number of questions.
 */
export function trackQuizComplete(score: number, total: number): void {
  send({ name: "quiz_complete", params: { score, total, percentage: Math.round((score / total) * 100) } });
}

/**
 * Tracks interactions with the civic timeline.
 * @param {number} stageIndex - The index of the timeline stage.
 * @param {string} stageName - The name of the stage.
 */
export function trackTimelineInteraction(stageIndex: number, stageName: string): void {
  send({ name: "timeline_interaction", params: { stage_index: stageIndex, stage_name: stageName } });
}

/**
 * Tracks toggling of voice-enabled features.
 * @param {string} mode - The voice mode enabled (e.g., 'stt', 'tts').
 */
export function trackVoiceToggle(mode: string): void {
  send({ name: "voice_toggle", params: { voice_mode: mode } });
}

/**
 * Tracks when the user changes the application language.
 * @param {string} languageCode - The selected language code.
 */
export function trackLanguageChange(languageCode: string): void {
  send({ name: "language_change", params: { language_code: languageCode } });
}

/**
 * Tracks chat messages sent to the AI assistant.
 * @param {string} detailLevel - The detail level of the response.
 * @param {boolean} [hasImage=false] - Whether the message included an image.
 */
export function trackChatMessage(detailLevel: string, hasImage: boolean = false): void {
  send({ name: "chat_message", params: { detail_level: detailLevel, has_image: hasImage } });
}

/**
 * Tracks document uploads for vision analysis.
 * @param {string} fileType - The MIME type or category of the file.
 */
export function trackDocumentUpload(fileType: string): void {
  send({ name: "document_upload", params: { file_type: fileType } });
}

/**
 * Tracks when the user switches themes (Light, Dark, High Contrast).
 * @param {string} theme - The name of the theme.
 */
export function trackThemeToggle(theme: string): void {
  send({ name: "theme_toggle", params: { theme_name: theme } });
}

/**
 * Tracks SPA route changes as virtual page views.
 * @param {string} path - The URL path of the page.
 */
export function trackPageView(path: string): void {
  const gaId = getGaId();
  if (!gaId || !window.gtag) return;
  window.gtag("config", gaId, { page_path: path });
}
