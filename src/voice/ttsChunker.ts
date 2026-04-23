/**
 * Language-aware text chunking for TTS.
 * Splits long text into natural sentence/phrase chunks
 * optimized for each Indian language.
 */

const SENTENCE_ENDINGS: Record<string, RegExp> = {
  hi: /[।!?\n]+/g,
  bn: /[।!?\n]+/g,
  ta: /[।!?\n.]+/g,
  te: /[।!?\n.]+/g,
  mr: /[।!?\n]+/g,
  gu: /[।!?\n]+/g,
  kn: /[।!?\n.]+/g,
  ml: /[।!?\n.]+/g,
  pa: /[।!?\n]+/g,
  or: /[।!?\n]+/g,
  as: /[।!?\n]+/g,
  en: /[.!?\n]+/g,
};

const MAX_CHUNK_LENGTH = 200;

export function chunkTextForTTS(text: string, langCode: string): string[] {
  if (!text.trim()) return [];

  const cleaned = text
    .replace(/[#*_`[\]()>~|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const baseLang = langCode.split("-")[0] ?? "en";
  const splitter = SENTENCE_ENDINGS[baseLang] ?? SENTENCE_ENDINGS["en"]!;

  // Split by sentence endings
  const rawSentences = cleaned.split(splitter).filter((s) => s.trim().length > 0);

  const chunks: string[] = [];
  for (const sentence of rawSentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if (trimmed.length <= MAX_CHUNK_LENGTH) {
      chunks.push(trimmed);
    } else {
      // Split long sentences by comma or semicolon
      const parts = trimmed.split(/[,;:]+/).filter((p) => p.trim().length > 0);
      let current = "";
      for (const part of parts) {
        if ((current + part).length > MAX_CHUNK_LENGTH && current) {
          chunks.push(current.trim());
          current = part;
        } else {
          current += (current ? ", " : "") + part.trim();
        }
      }
      if (current.trim()) chunks.push(current.trim());
    }
  }

  return chunks.length > 0 ? chunks : [cleaned];
}
