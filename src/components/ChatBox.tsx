import { useState, useCallback, useRef, memo, useMemo, lazy, Suspense, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Loader2, Sparkles, MessageSquare, Eye } from "lucide-react";
import { sanitizeInput } from "@/utils/date";
import { logger } from "@/utils/logger";
import { trackApiLatency } from "@/utils/performance";
import { validateStructuredResponse } from "@/utils/schemaValidation";
import { computeConfidenceBreakdown } from "@/utils/confidenceEngine";
import StructuredResponse from "@/components/StructuredResponse";
import ConfidenceBreakdownCard from "@/components/ConfidenceBreakdownCard";
import ParseErrorCard from "@/components/ParseErrorCard";
import AITransparencyPanel from "@/components/AITransparencyPanel";
import CitationsPanel from "@/components/CitationsPanel";
import { getVoiceMode } from "@/voice/voiceModeStore";
import type { ChatMessage, DetailLevel, StructuredAIResponse, UserProfile, ConfidenceBreakdown, StateInfo } from "@/types/civic";
import type { VoiceCommand } from "@/voice/voiceCommands";
import { FAQ_ITEMS } from "@/data/civicContent";

const VoiceControls = lazy(() => import("@/voice/VoiceControls"));

const PARTISAN_REFUSAL =
  "I provide information about the election process but cannot recommend candidates, predict outcomes, or give voting advice.";

function isPartisanQuery(input: string): boolean {
  const patterns = [
    /who should i vote for/i,
    /which (party|candidate) is (best|better)/i,
    /will .+ win/i,
    /predict .+ election/i,
    /should i vote (for|against)/i,
    /endorse/i,
  ];
  return patterns.some((p) => p.test(input));
}

function findLocalAnswer(input: string): string | null {
  const lower = input.toLowerCase();
  const match = FAQ_ITEMS.find(
    (faq) =>
      lower.includes(faq.question.toLowerCase().slice(0, 20)) ||
      faq.question.toLowerCase().includes(lower.slice(0, 20))
  );
  return match?.answer ?? null;
}

interface ChatBoxProps {
  profile?: UserProfile | null;
  selectedState?: StateInfo | null;
}

const ChatBox = memo(function ChatBox({ profile, selectedState }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detailLevel] = useState<DetailLevel>("beginner");
  const [useStructured, setUseStructured] = useState(true);
  const [simpleMode, setSimpleMode] = useState(false);
  const [lastBreakdown, setLastBreakdown] = useState<ConfidenceBreakdown | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const [lastStructured, setLastStructured] = useState<StructuredAIResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const speakRef = useRef<((text: string) => void) | null>(null);
  const prevMsgCountRef = useRef(0);

  const supabaseUrl = useMemo(() => import.meta.env.VITE_SUPABASE_URL as string | undefined, []);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addMessage = useCallback(
    (role: ChatMessage["role"], content: string, confidence?: ChatMessage["confidence"], structured?: StructuredAIResponse | null, parseError?: boolean) => {
      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        role,
        content,
        timestamp: new Date(),
        confidence,
        structured: structured ?? undefined,
        parseError,
      };
      setMessages((prev) => [...prev, msg]);
      if (structured) setLastStructured(structured);
      setTimeout(scrollToBottom, 50);
      return msg;
    },
    [scrollToBottom]
  );

  const loadingMessages = useMemo(() => [
    "Analyzing election process…",
    "Mapping timeline stage…",
    "Evaluating requirements…",
  ], []);

  const [loadingText, setLoadingText] = useState(loadingMessages[0]);

  const effectiveDetailLevel = simpleMode ? "beginner" as DetailLevel : detailLevel;

  const handleVoiceTranscript = useCallback((text: string) => {
    const mode = getVoiceMode();
    if (mode === "speak-only") {
      // In speak-only mode, auto-submit instead of filling input
      setInput(text);
      // Auto submit after brief delay
      setTimeout(() => {
        const form = document.getElementById("chat-form") as HTMLFormElement;
        form?.requestSubmit();
      }, 100);
    } else {
      setInput(text);
    }
  }, []);

  const handleVoiceCommand = useCallback((cmd: VoiceCommand) => {
    if (cmd.type === "summarize") {
      const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
      if (lastAssistant && speakRef.current) {
        const summary = lastAssistant.structured?.summary || lastAssistant.content.slice(0, 300);
        speakRef.current(summary);
      }
    } else if (cmd.type === "next") {
      // Focus input for next question
      inputRef.current?.focus();
    }
  }, [messages]);

  // Auto-speak new assistant messages
  useEffect(() => {
    if (messages.length > prevMsgCountRef.current) {
      const last = messages[messages.length - 1];
      if (last?.role === "assistant" && speakRef.current) {
        const textToSpeak = last.structured?.summary || last.content;
        if (textToSpeak.trim()) {
          speakRef.current(textToSpeak);
        }
      }
    }
    prevMsgCountRef.current = messages.length;
  }, [messages]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const sanitized = sanitizeInput(input);
      if (!sanitized) return;

      setInput("");
      setLastQuery(sanitized);

      // In speak-only mode, still add to chat but user won't see it prominently
      addMessage("user", sanitized);

      const breakdown = computeConfidenceBreakdown(sanitized, profile);
      setLastBreakdown(breakdown);

      if (isPartisanQuery(sanitized)) {
        addMessage("assistant", PARTISAN_REFUSAL, "high");
        return;
      }

      const localAnswer = findLocalAnswer(sanitized);
      if (localAnswer) {
        addMessage("assistant", localAnswer, "high");
        return;
      }

      if (!supabaseUrl) {
        addMessage(
          "assistant",
          "AI assistant is not configured yet. Here are some topics I can help with locally: voter registration, election types, ballot secrecy, and more. Try asking about those!",
          "low"
        );
        return;
      }

      setIsLoading(true);
      let loadingIdx = 0;
      const loadingInterval = setInterval(() => {
        loadingIdx = (loadingIdx + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[loadingIdx]);
      }, 1500);

      const startTime = performance.now();

      try {
        const allMessages = [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: sanitized },
        ];

        if (useStructured) {
          const resp = await fetch(`${supabaseUrl}/functions/v1/civic-chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ""}`,
            },
            body: JSON.stringify({ messages: allMessages, detailLevel: effectiveDetailLevel, structured: true, simpleMode }),
          });

          trackApiLatency("civic-chat-structured", startTime);

          if (resp.status === 429) { addMessage("assistant", "Too many requests. Please wait a moment and try again.", "low"); return; }
          if (resp.status === 402) { addMessage("assistant", "Service temporarily unavailable. Please try again later.", "low"); return; }
          if (!resp.ok) throw new Error("AI request failed");

          const data = await resp.json();

          if (data.structured) {
            const validation = validateStructuredResponse(data.structured);
            if (validation.valid && validation.data) {
              validation.data.confidence_score = breakdown.level;
              addMessage("assistant", validation.data.summary || "Here is the information:", breakdown.level, validation.data);
            } else {
              addMessage("assistant", data.structured?.summary || data.content || "Response format issue.", breakdown.level, null, true);
              logger.warn("Schema validation failed", { errors: validation.errors });
            }
          } else {
            addMessage("assistant", data.content || "I couldn't generate a response.", breakdown.level);
          }
          return;
        }

        // Streaming mode
        const resp = await fetch(`${supabaseUrl}/functions/v1/civic-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ""}`,
          },
          body: JSON.stringify({ messages: allMessages, detailLevel: effectiveDetailLevel, simpleMode }),
        });

        trackApiLatency("civic-chat-stream", startTime);

        if (resp.status === 429) { addMessage("assistant", "Too many requests. Please wait a moment and try again.", "low"); return; }
        if (resp.status === 402) { addMessage("assistant", "Service temporarily unavailable. Please try again later.", "low"); return; }
        if (!resp.ok) throw new Error("AI request failed");

        if (!resp.body) throw new Error("No stream body");
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";
        let textBuffer = "";
        let msgAdded = false;

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                assistantContent += content;
                if (!msgAdded) {
                  addMessage("assistant", assistantContent, breakdown.level);
                  msgAdded = true;
                } else {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last?.role === "assistant") {
                      updated[updated.length - 1] = { ...last, content: assistantContent };
                    }
                    return updated;
                  });
                }
              }
            } catch {
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        if (!msgAdded && !assistantContent) {
          addMessage("assistant", "I couldn't generate a response. Please try rephrasing your question.", "low");
        }
      } catch (err) {
        logger.error("Chat error", { error: String(err) });
        addMessage(
          "assistant",
          "Sorry, I encountered an error. Please try again or browse the FAQ section above for common questions.",
          "low"
        );
      } finally {
        clearInterval(loadingInterval);
        setIsLoading(false);
      }
    },
    [input, messages, addMessage, effectiveDetailLevel, supabaseUrl, useStructured, profile, loadingMessages, simpleMode]
  );

  const confidenceColor = useCallback((c?: ChatMessage["confidence"]) => {
    switch (c) {
      case "high": return "civic-badge-success";
      case "medium": return "civic-badge-info";
      case "low": return "civic-badge-gold";
      default: return "";
    }
  }, []);

  return (
    <section className="py-16 px-4" aria-labelledby="chat-heading">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="civic-badge-info mb-3 inline-block">🤖 AI-Powered</span>
          <h2 id="chat-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Guided Civic Assistant
          </h2>
          <p className="text-muted-foreground font-sans max-w-lg mx-auto">
            Ask questions about Indian elections, government, and civic participation — factual, non-partisan, with structured intelligence
          </p>
        </div>

        {/* Voice Controls */}
        <div className="flex justify-center mb-6">
          <Suspense fallback={null}>
            <VoiceControls
              selectedState={selectedState ?? null}
              onTranscript={handleVoiceTranscript}
              speakRef={speakRef}
              onVoiceCommand={handleVoiceCommand}
            />
          </Suspense>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2 mb-3 flex-wrap">
          <button
            onClick={() => setSimpleMode(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-sans transition focus:outline-none focus:ring-2 focus:ring-ring ${
              !simpleMode ? "bg-accent text-accent-foreground" : "bg-card border text-muted-foreground"
            }`}
            aria-pressed={!simpleMode}
          >
            Standard Mode
          </button>
          <button
            onClick={() => setSimpleMode(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-sans transition focus:outline-none focus:ring-2 focus:ring-ring flex items-center gap-1.5 ${
              simpleMode ? "bg-civic-gold text-foreground" : "bg-card border text-muted-foreground"
            }`}
            aria-pressed={simpleMode}
          >
            <Eye className="w-3 h-3" /> Simple Mode
          </button>
        </div>

        {simpleMode && (
          <p className="text-xs text-center text-civic-gold font-sans mb-3">
            ✨ Simple Mode: Explanations use plain language, short sentences, and examples
          </p>
        )}

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setUseStructured(true)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium font-sans transition focus:outline-none focus:ring-2 focus:ring-ring flex items-center gap-1.5 ${
              useStructured ? "bg-accent text-accent-foreground" : "bg-card border text-muted-foreground"
            }`}
            aria-pressed={useStructured}
          >
            <Sparkles className="w-3 h-3" /> Structured
          </button>
          <button
            onClick={() => setUseStructured(false)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium font-sans transition focus:outline-none focus:ring-2 focus:ring-ring flex items-center gap-1.5 ${
              !useStructured ? "bg-accent text-accent-foreground" : "bg-card border text-muted-foreground"
            }`}
            aria-pressed={!useStructured}
          >
            <MessageSquare className="w-3 h-3" /> Streaming
          </button>
        </div>

        {/* Chat area */}
        <div
          className="civic-card p-5 h-[28rem] overflow-y-auto mb-4 space-y-3 scroll-smooth"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-accent" />
              </div>
              <p className="text-muted-foreground text-sm font-sans">
                Ask about elections, voting, registration…
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {["How do I register to vote?", "Explain EVM voting", "What is NOTA?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-1.5 rounded-full text-xs font-sans bg-muted hover:bg-muted/80 text-muted-foreground transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-sans ${
                  msg.role === "user"
                    ? "bg-accent text-accent-foreground rounded-br-md"
                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" && msg.parseError ? (
                  <ParseErrorCard errors={["Response format validation failed"]} fallbackContent={msg.content} />
                ) : msg.role === "assistant" && msg.structured ? (
                  <StructuredResponse data={msg.structured} />
                ) : msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
                {msg.confidence && msg.role === "assistant" && !msg.structured && !msg.parseError && (
                  <span className={`${confidenceColor(msg.confidence)} mt-2 inline-block text-[10px]`}>
                    {msg.confidence} confidence
                  </span>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl px-4 py-3 text-sm text-muted-foreground font-sans flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {loadingText}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* AI Transparency + Citations */}
        {lastBreakdown && messages.length > 0 && (
          <div className="mb-4 space-y-3">
            <AITransparencyPanel breakdown={lastBreakdown} structured={lastStructured} query={lastQuery} />
            <CitationsPanel query={lastQuery} structured={lastStructured} breakdown={lastBreakdown} />
            <ConfidenceBreakdownCard breakdown={lastBreakdown} />
          </div>
        )}

        {/* Input */}
        <form id="chat-form" onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about elections, voting, registration…"
            maxLength={500}
            className="flex-1 px-4 py-3 rounded-xl border bg-card text-foreground text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            aria-label="Type your question about elections"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-medium font-sans transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 flex items-center gap-2"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-3 font-sans">
          ⚠️ This is an informational tool, not affiliated with the Election Commission of India. Always verify at{" "}
          <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">eci.gov.in</a>.
        </p>
      </div>
    </section>
  );
});

export default ChatBox;
