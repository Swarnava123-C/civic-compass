import { useState, useCallback, useRef, useEffect } from "react";

const AUDIO_ENABLED_KEY = "civicflow_audio_enabled";

interface SpeechSynthesisHook {
  isSpeaking: boolean;
  currentText: string;
  isMuted: boolean;
  speak: (text: string) => void;
  cancel: () => void;
  toggleMute: () => void;
  setRate: (rate: number) => void;
  rate: number;
}

export function useSpeechSynthesis(bcp47: string): SpeechSynthesisHook {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem(AUDIO_ENABLED_KEY) === "false";
  });
  const [rate, setRateState] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cancel = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setCurrentText("");
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (isMuted || !window.speechSynthesis || !text.trim()) return;

      cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = bcp47;
      utterance.rate = rate;

      // Try to find a matching voice
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => v.lang === bcp47) ?? voices.find((v) => v.lang.startsWith(bcp47.split("-")[0]));
      if (match) utterance.voice = match;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentText(text);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentText("");
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentText("");
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [bcp47, rate, isMuted, cancel]
  );

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

  // Cancel on unmount or language change
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [bcp47]);

  return { isSpeaking, currentText, isMuted, speak, cancel, toggleMute, setRate, rate };
}
