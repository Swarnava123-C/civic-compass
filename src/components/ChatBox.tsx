import { useState, useCallback, useRef, memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { sanitizeInput } from "@/utils/date";
import { logger } from "@/utils/logger";
import { trackApiLatency } from "@/utils/performance";
import StructuredResponse from "@/components/StructuredResponse";
import type { ChatMessage, DetailLevel, StructuredAIResponse } from "@/types/civic";
import { FAQ_ITEMS } from "@/data/civicContent";

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

function computeConfidence(input: string): "high" | "medium" | "low" {
  const statePattern = /\b(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)\b/i;
  const processPattern = /\b(register|registration|vote|voting|ballot|polling|absentee|primary|election|campaign|count|recount|certif)\b/i;

  const hasState = statePattern.test(input);
  const hasProcess = processPattern.test(input);

  if (hasState && hasProcess) return "high";
  if (hasProcess) return "medium";
  return "low";
}

const ChatBox = memo(function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("beginner");
  const [useStructured, setUseStructured] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const supabaseUrl = useMemo(() => import.meta.env.VITE_SUPABASE_URL as string | undefined, []);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addMessage = useCallback(
    (role: ChatMessage["role"], content: string, confidence?: ChatMessage["confidence"], structured?: StructuredAIResponse | null) => {
      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        role,
        content,
        timestamp: new Date(),
        confidence,
        structured: structured ?? undefined,
      };
      setMessages((prev) => [...prev, msg]);
      setTimeout(scrollToBottom, 50);
      return msg;
    },
    [scrollToBottom]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const sanitized = sanitizeInput(input);
      if (!sanitized) return;

      setInput("");
      addMessage("user", sanitized);

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
      const startTime = performance.now();

      try {
        const allMessages = [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: sanitized },
        ];

        const confidence = computeConfidence(sanitized);

        if (useStructured) {
          // Structured mode — non-streaming
          const resp = await fetch(`${supabaseUrl}/functions/v1/civic-chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ""}`,
            },
            body: JSON.stringify({ messages: allMessages, detailLevel, structured: true }),
          });

          trackApiLatency("civic-chat-structured", startTime);

          if (resp.status === 429) { addMessage("assistant", "Too many requests. Please wait a moment and try again.", "low"); return; }
          if (resp.status === 402) { addMessage("assistant", "Service temporarily unavailable. Please try again later.", "low"); return; }
          if (!resp.ok) throw new Error("AI request failed");

          const data = await resp.json();

          if (data.structured) {
            const s = data.structured as StructuredAIResponse;
            // Override confidence with our local engine
            s.confidence_score = confidence;
            addMessage("assistant", s.summary || "Here is the information:", confidence, s);
          } else {
            addMessage("assistant", data.content || "I couldn't generate a response.", confidence);
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
          body: JSON.stringify({ messages: allMessages, detailLevel }),
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
                  addMessage("assistant", assistantContent, confidence);
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
        setIsLoading(false);
      }
    },
    [input, messages, addMessage, detailLevel, supabaseUrl, useStructured]
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
    <section className="py-16 px-4 bg-muted/30" aria-labelledby="chat-heading">
      <div className="container max-w-3xl mx-auto">
        <h2 id="chat-heading" className="text-3xl font-bold text-foreground mb-2 text-center">
          Guided Civic Assistant
        </h2>
        <p className="text-muted-foreground text-center mb-4 font-sans">
          AI-powered Q&A — factual, non-partisan, with structured intelligence
        </p>

        {/* Controls */}
        <div className="flex justify-center gap-2 mb-3 flex-wrap">
          <button
            onClick={() => setDetailLevel("beginner")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-sans transition focus:outline-none focus:ring-2 focus:ring-ring ${
              detailLevel === "beginner" ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground"
            }`}
            aria-pressed={detailLevel === "beginner"}
            aria-label="Set detail level to beginner"
          >
            Beginner
          </button>
          <button
            onClick={() => setDetailLevel("detailed")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-sans transition focus:outline-none focus:ring-2 focus:ring-ring ${
              detailLevel === "detailed" ? "bg-primary text-primary-foreground" : "bg-card border text-muted-foreground"
            }`}
            aria-pressed={detailLevel === "detailed"}
            aria-label="Set detail level to detailed"
          >
            Detailed
          </button>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setUseStructured(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-sans transition focus:outline-none focus:ring-2 focus:ring-ring ${
              useStructured ? "bg-accent text-accent-foreground" : "bg-card border text-muted-foreground"
            }`}
            aria-pressed={useStructured}
            aria-label="Enable structured output mode"
          >
            📊 Structured
          </button>
          <button
            onClick={() => setUseStructured(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-sans transition focus:outline-none focus:ring-2 focus:ring-ring ${
              !useStructured ? "bg-accent text-accent-foreground" : "bg-card border text-muted-foreground"
            }`}
            aria-pressed={!useStructured}
            aria-label="Enable streaming chat mode"
          >
            💬 Streaming
          </button>
        </div>

        {/* Chat area */}
        <div
          className="civic-card p-4 h-96 overflow-y-auto mb-4 space-y-3"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground text-sm font-sans py-8">
              Ask a question about elections, voting, or civic processes…
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm font-sans ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {msg.role === "assistant" && msg.structured ? (
                  <StructuredResponse data={msg.structured} />
                ) : msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
                {msg.confidence && msg.role === "assistant" && !msg.structured && (
                  <span className={`${confidenceColor(msg.confidence)} mt-1 inline-block text-[10px]`}>
                    {msg.confidence} confidence
                  </span>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-xl px-4 py-2.5 text-sm text-muted-foreground font-sans animate-pulse">
                {useStructured ? "Analyzing…" : "Thinking…"}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about elections, voting, registration…"
            maxLength={500}
            className="flex-1 px-4 py-2.5 rounded-xl border bg-card text-foreground text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Type your question about elections"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium font-sans transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            aria-label="Send question"
          >
            Send
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-3 font-sans">
          ⚠️ This is an informational tool, not an official government source. Always verify with your local election authority.
        </p>
      </div>
    </section>
  );
});

export default ChatBox;
