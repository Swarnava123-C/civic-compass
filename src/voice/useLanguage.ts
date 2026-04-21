import { useState, useCallback, useEffect } from "react";
import { detectBrowserLanguage, persistLanguage, getLanguageByCode, INDIAN_LANGUAGES, type IndianLanguage } from "./languageConfig";

export function useLanguage() {
  const [langCode, setLangCode] = useState<string>(() => detectBrowserLanguage());

  const language: IndianLanguage = getLanguageByCode(langCode) ?? INDIAN_LANGUAGES[0];

  const setLanguage = useCallback((code: string) => {
    setLangCode(code);
    persistLanguage(code);
  }, []);

  // sync if localStorage was changed in another tab
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "civicflow_language" && e.newValue) {
        setLangCode(e.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return { langCode, language, setLanguage, allLanguages: INDIAN_LANGUAGES };
}
