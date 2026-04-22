import { useState, useCallback, useRef, useEffect } from "react";
import { chunkTextForTTS } from "./ttsChunker";

const AUDIO_ENABLED_KEY = "civicflow_audio_enabled";

interface SpeechSynthesisHook {
  isSpeaking: boolean;
  currentText: string;
  currentChunkIndex: number;
  totalChunks: number;
  isMuted: boolean;
  speak: (text: string) => void;
  cancel: () => void;
  toggleMute: () => void;
  setRate: (rate: number) => void;
  rate: number;
  repeatLast: () => void;
}

export function useSpeechSynthesis(bcp47: string): SpeechSynthesisHook {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem(AUDIO_ENABLED_KEY) === "false";
  });
  const [rate, setRateState] = useState(1);
  const chunksRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);
  const cancelledRef = useRef(false);
  const lastTextRef = useRef("");

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setCurrentText("");
    setCurrentChunkIndex(0);
    setTotalChunks(0);
  }, []);

  const speakChunk = useCallback(
    (chunks: string[], index: number) => {
      if (cancelledRef.current || index >= chunks.length || isMuted) {
        setIsSpeaking(false);
        setCurrentText("");
        return;
      }

      const text = chunks[index];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = bcp47;
      utterance.rate = rate;

      // Find best matching voice for the language
      const voices = window.speechSynthesis.getVoices();
      const exactMatch = voices.find((v) => v.lang === bcp47);
      const prefixMatch = voices.find((v) => v.lang.startsWith(bcp47.split("-")[0]));
      if (exactMatch) utterance.voice = exactMatch;
      else if (prefixMatch) utterance.voice = prefixMatch;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentText(text);
        setCurrentChunkIndex(index);
      };

      utterance.onend = () => {
        currentIndexRef.current = index + 1;
        if (index + 1 < chunks.length && !cancelledRef.current) {
          speakChunk(chunks, index + 1);
        } else {
          setIsSpeaking(false);
          setCurrentText("");
        }
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentText("");
      };

      // Don't steal focus — speak without creating focusable elements
      window.speechSynthesis.speak(utterance);
    },
    [bcp47, rate, isMuted]
  );

  const speak = useCallback(
    (text: string) => {
      if (isMuted || !window.speechSynthesis || !text.trim()) return;

      cancel();
      cancelledRef.current = false;
      lastTextRef.current = text;

      const chunks = chunkTextForTTS(text, bcp47);
      chunksRef.current = chunks;
      currentIndexRef.current = 0;
      setTotalChunks(chunks.length);

      // Small delay to let cancel() complete
      setTimeout(() => {
        if (!cancelledRef.current) {
          speakChunk(chunks, 0);
        }
      }, 50);
    },
    [bcp47, isMuted, cancel, speakChunk]
  );

  const repeatLast = useCallback(() => {
    if (lastTextRef.current) {
      speak(lastTextRef.current);
    }
  }, [speak]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem(AUDIO_ENABLED_KEY, String(!next));
      if (next) cancel();
      return next;
    });
  }, [cancel]);

  const setRate = useCallback((r: number) => {
    setRateState(Math.max(0.5, Math.min(2, r)));
  }, []);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [bcp47]);

  return {
    isSpeaking,
    currentText,
    currentChunkIndex,
    totalChunks,
    isMuted,
    speak,
    cancel,
    toggleMute,
    setRate,
    rate,
    repeatLast,
  };
}
