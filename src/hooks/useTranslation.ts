import { useState, useCallback, useRef } from "react";

const translationCache = new Map<string, string>();

function cacheKey(text: string, lang: string): string {
  return `${lang}:${text.slice(0, 200)}`;
}

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const translate = useCallback(async (text: string, targetLanguage: string): Promise<string> => {
    if (!text.trim() || targetLanguage === "en") return text;

    const key = cacheKey(text, targetLanguage);
    const cached = translationCache.get(key);
    if (cached) return cached;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsTranslating(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const resp = await fetch(`${supabaseUrl}/functions/v1/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ""}`,
        },
        body: JSON.stringify({ text, targetLanguage }),
        signal: controller.signal,
      });

      if (!resp.ok) return text; // fallback to original

      const data = await resp.json();
      const translation = data.translation || text;
      translationCache.set(key, translation);
      return translation;
    } catch {
      return text; // fallback on error
    } finally {
      setIsTranslating(false);
    }
  }, []);

  return { translate, isTranslating };
}
