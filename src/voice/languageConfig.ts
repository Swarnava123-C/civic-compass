/**
 * Indian language configuration for CivicFlow voice system
 */

export interface IndianLanguage {
  code: string;
  bcp47: string;
  name: string;
  nativeName: string;
  states: string[]; // state codes where this language is primary
}

export const INDIAN_LANGUAGES: IndianLanguage[] = [
  { code: "en", bcp47: "en-IN", name: "English", nativeName: "English", states: ["AN", "CH", "DN", "LA", "LD", "PY", "DL", "GA", "SK", "NL", "MZ", "ML", "MN", "AR"] },
  { code: "hi", bcp47: "hi-IN", name: "Hindi", nativeName: "हिन्दी", states: ["UP", "UK", "MP", "CG", "RJ", "HR", "JH", "BR", "DL", "HP", "JK"] },
  { code: "bn", bcp47: "bn-IN", name: "Bengali", nativeName: "বাংলা", states: ["WB", "TR"] },
  { code: "ta", bcp47: "ta-IN", name: "Tamil", nativeName: "தமிழ்", states: ["TN", "PY"] },
  { code: "te", bcp47: "te-IN", name: "Telugu", nativeName: "తెలుగు", states: ["AP", "TS"] },
  { code: "mr", bcp47: "mr-IN", name: "Marathi", nativeName: "मराठी", states: ["MH"] },
  { code: "gu", bcp47: "gu-IN", name: "Gujarati", nativeName: "ગુજરાતી", states: ["GJ", "DN"] },
  { code: "kn", bcp47: "kn-IN", name: "Kannada", nativeName: "ಕನ್ನಡ", states: ["KA"] },
  { code: "ml", bcp47: "ml-IN", name: "Malayalam", nativeName: "മലയാളം", states: ["KL", "LD"] },
  { code: "pa", bcp47: "pa-IN", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", states: ["PB", "CH"] },
  { code: "or", bcp47: "or-IN", name: "Odia", nativeName: "ଓଡ଼ିଆ", states: ["OD"] },
  { code: "as", bcp47: "as-IN", name: "Assamese", nativeName: "অসমীয়া", states: ["AS"] },
];

const BROWSER_TO_LANG: Record<string, string> = {
  "bn": "bn", "bn-IN": "bn", "bn-BD": "bn",
  "ta": "ta", "ta-IN": "ta",
  "te": "te", "te-IN": "te",
  "mr": "mr", "mr-IN": "mr",
  "gu": "gu", "gu-IN": "gu",
  "kn": "kn", "kn-IN": "kn",
  "ml": "ml", "ml-IN": "ml",
  "pa": "pa", "pa-IN": "pa",
  "or": "or", "or-IN": "or",
  "as": "as", "as-IN": "as",
  "hi": "hi", "hi-IN": "hi",
  "en": "en", "en-IN": "en", "en-US": "en", "en-GB": "en",
};

const STORAGE_KEY = "civicflow_language";

export function detectBrowserLanguage(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && INDIAN_LANGUAGES.some((l) => l.code === stored)) return stored;

  const browserLang = navigator.language || (navigator as any).userLanguage || "en";
  const exact = BROWSER_TO_LANG[browserLang];
  if (exact) return exact;

  const prefix = browserLang.split("-")[0];
  const prefixMatch = BROWSER_TO_LANG[prefix];
  if (prefixMatch) return prefixMatch;

  return "hi"; // fallback to Hindi
}

export function persistLanguage(code: string): void {
  localStorage.setItem(STORAGE_KEY, code);
}

export function getLanguageByCode(code: string): IndianLanguage | undefined {
  return INDIAN_LANGUAGES.find((l) => l.code === code);
}

export function getLanguagesForState(stateCode: string): IndianLanguage[] {
  const matches = INDIAN_LANGUAGES.filter((l) => l.states.includes(stateCode));
  // Always include English and Hindi
  const codes = new Set(matches.map((m) => m.code));
  if (!codes.has("en")) matches.push(INDIAN_LANGUAGES[0]);
  if (!codes.has("hi")) matches.push(INDIAN_LANGUAGES[1]);
  return matches;
}
