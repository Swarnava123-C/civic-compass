import { memo, useCallback, useEffect, useRef as useReactRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, Languages, Minus, Plus, MessageSquare, AudioLines, Radio } from "lucide-react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useSpeechSynthesis } from "./useSpeechSynthesis";
import { useLanguage } from "./useLanguage";
import { getLanguagesForState } from "./languageConfig";
import { getVoiceMode, setVoiceMode as persistVoiceMode, type VoiceMode } from "./voiceModeStore";
import { detectVoiceCommand, type VoiceCommand } from "./voiceCommands";
import SubtitleOverlay from "./SubtitleOverlay";
import type { StateInfo } from "@/types/civic";

interface VoiceControlsProps {
  selectedState: StateInfo | null;
  onTranscript?: (text: string) => void;
  speakRef?: React.MutableRefObject<((text: string) => void) | null>;
  onVoiceCommand?: (cmd: VoiceCommand) => void;
}

const VoiceControls = memo(function VoiceControls({ selectedState, onTranscript, speakRef, onVoiceCommand }: VoiceControlsProps) {
  const { langCode, language, setLanguage, allLanguages } = useLanguage();
  const stateLanguages = selectedState ? getLanguagesForState(selectedState.code) : allLanguages;

  const { isListening, transcript, error, isSupported, startListening, stopListening } = useSpeechRecognition(language.bcp47);
  const { isSpeaking, currentText, currentChunkIndex, totalChunks, isMuted, speak, cancel, toggleMute, setRate, rate, repeatLast } = useSpeechSynthesis(language.bcp47);

  const [voiceMode, setVoiceModeState] = useState<VoiceMode>(() => getVoiceMode());

  const changeVoiceMode = useCallback((mode: VoiceMode) => {
    setVoiceModeState(mode);
    persistVoiceMode(mode);
  }, []);

  // Push transcript to parent when final — detect voice commands first
  useEffect(() => {
    if (!isListening && transcript && onTranscript) {
      const cmd = detectVoiceCommand(transcript);
      if (cmd.type !== "none") {
        // Handle built-in commands
        if (cmd.type === "stop") { cancel(); return; }
        if (cmd.type === "mute") { if (!isMuted) toggleMute(); return; }
        if (cmd.type === "unmute") { if (isMuted) toggleMute(); return; }
        if (cmd.type === "repeat") { repeatLast(); return; }
        // Forward other commands to parent
        onVoiceCommand?.(cmd);
        return;
      }
      onTranscript(transcript);
    }
  }, [isListening, transcript, onTranscript, onVoiceCommand, cancel, isMuted, toggleMute, repeatLast]);

  // Expose speak function (respecting voice mode)
  useEffect(() => {
    if (speakRef) {
      speakRef.current = (text: string) => {
        if (voiceMode === "chat-only") return; // don't speak in chat-only mode
        speak(text);
      };
    }
    return () => {
      if (speakRef) speakRef.current = null;
    };
  }, [speakRef, speak, voiceMode]);

  const handleMicToggle = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  const voiceModeOptions: { mode: VoiceMode; label: string; icon: typeof MessageSquare }[] = [
    { mode: "chat-only", label: "Chat", icon: MessageSquare },
    { mode: "both", label: "Both", icon: Radio },
    { mode: "speak-only", label: "Voice", icon: AudioLines },
  ];

  return (
    <>
      <SubtitleOverlay
        text={currentText}
        isVisible={isSpeaking}
        chunkIndex={currentChunkIndex}
        totalChunks={totalChunks}
      />

      <div className="flex flex-col gap-2" role="toolbar" aria-label="Voice controls">
        {/* Voice Mode Toggle */}
        <div className="flex items-center justify-center gap-1 bg-card rounded-xl border p-1">
          {voiceModeOptions.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => changeVoiceMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                voiceMode === mode
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              aria-pressed={voiceMode === mode}
              aria-label={`Voice mode: ${label}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Language selector */}
          <div className="relative">
            <select
              value={langCode}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none pl-7 pr-3 py-1.5 rounded-lg border bg-card text-foreground text-xs font-sans focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              aria-label="Select language"
            >
              {stateLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
            <Languages className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Mic button */}
          {isSupported && voiceMode !== "chat-only" && (
            <motion.button
              onClick={handleMicToggle}
              className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                isListening
                  ? "bg-destructive text-destructive-foreground shadow-lg"
                  : "bg-card border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
              aria-pressed={isListening}
              role="button"
              tabIndex={0}
            >
              {isListening ? (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <MicOff className="w-4 h-4" />
                </motion.div>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </motion.button>
          )}

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-ring ${
              isMuted ? "bg-muted text-muted-foreground" : "bg-card text-foreground hover:bg-muted"
            }`}
            aria-label={isMuted ? "Unmute audio — AI will speak responses" : "Mute audio — AI will stop speaking"}
            aria-pressed={isMuted}
            role="button"
            tabIndex={0}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Speech rate */}
          {!isMuted && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
              <button
                onClick={() => setRate(rate - 0.25)}
                disabled={rate <= 0.5}
                className="p-1 rounded hover:bg-muted disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Decrease speech rate"
                tabIndex={0}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center">{rate}×</span>
              <button
                onClick={() => setRate(rate + 0.25)}
                disabled={rate >= 2}
                className="p-1 rounded hover:bg-muted disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Increase speech rate"
                tabIndex={0}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Speaking indicator */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-accent font-sans"
                aria-live="polite"
              >
                🔊 Speaking…
              </motion.span>
            )}
          </AnimatePresence>

          {/* Listening waveform indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-0.5"
                aria-live="polite"
                aria-label="Listening started"
              >
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-destructive rounded-full"
                    animate={{ height: [4, 14, 4] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-[10px] text-destructive font-sans mt-1 text-center" role="alert">
          {error}
        </p>
      )}

      {/* Voice commands hint */}
      {voiceMode !== "chat-only" && !isListening && (
        <p className="text-[10px] text-muted-foreground font-sans text-center mt-1">
          Voice commands: "summarize", "repeat", "next step", "stop"
        </p>
      )}
    </>
  );
});

export default VoiceControls;
