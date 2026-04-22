/**
 * Voice mode preference store with localStorage persistence.
 */

export type VoiceMode = "chat-only" | "speak-only" | "both";

const VOICE_MODE_KEY = "civicflow_voice_mode";

export function getVoiceMode(): VoiceMode {
  const stored = localStorage.getItem(VOICE_MODE_KEY);
  if (stored === "chat-only" || stored === "speak-only" || stored === "both") {
    return stored;
  }
  return "both";
}

export function setVoiceMode(mode: VoiceMode): void {
  localStorage.setItem(VOICE_MODE_KEY, mode);
}
