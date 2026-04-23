import { useState, useCallback, useRef, useEffect } from "react";

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
}

function getSpeechRecognitionAPI(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const win = window as unknown as Record<string, unknown>;
  return (win["SpeechRecognition"] ?? win["webkitSpeechRecognition"]) as SpeechRecognitionConstructor | null;
}

export function useSpeechRecognition(bcp47: string): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const SpeechRecognitionAPI = getSpeechRecognitionAPI();
  const isSupported = !!SpeechRecognitionAPI;

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = bcp47;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result?.[0]) {
            finalTranscript += result[0].transcript;
          }
        }
        setTranscript(finalTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        const msg =
          event.error === "not-allowed"
            ? "Microphone permission denied"
            : event.error === "no-speech"
            ? "No speech detected. Please try again."
            : `Speech error: ${event.error}`;
        setError(msg);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setError("Failed to start speech recognition");
    }
  }, [bcp47, SpeechRecognitionAPI]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  // Update lang when bcp47 changes
  useEffect(() => {
    if (isListening) {
      recognitionRef.current?.abort();
      setIsListening(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bcp47]);

  return { isListening, transcript, error, isSupported, startListening, stopListening };
}
