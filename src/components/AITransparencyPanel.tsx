import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Shield, Clock, BookOpen, AlertTriangle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { ConfidenceBreakdown, StructuredAIResponse } from "@/types/civic";

interface Props {
  breakdown: ConfidenceBreakdown;
  structured?: StructuredAIResponse | null;
  query: string;
}

const OPINION_PATTERNS = [
  /who (is|should|will) (best|better|win)/i,
  /predict/i,
  /opinion/i,
  /should i/i,
  /recommend/i,
  /which party/i,
];

const AITransparencyPanel = memo(function AITransparencyPanel({ breakdown, structured, query }: Props) {
  const isOpinionSensitive = useMemo(() => OPINION_PATTERNS.some((p) => p.test(query)), [query]);

  const adjustedLevel = isOpinionSensitive && breakdown.level === "high" ? "medium" : breakdown.level;

  const levelConfig = useMemo(() => {
    switch (adjustedLevel) {
      case "high": return { color: "text-civic-success", bg: "bg-civic-success/10", label: "High Confidence" };
      case "medium": return { color: "text-civic-amber", bg: "bg-civic-amber/10", label: "Medium Confidence" };
      default: return { color: "text-destructive", bg: "bg-destructive/10", label: "Low Confidence" };
    }
  }, [adjustedLevel]);

  const sources = useMemo(() => {
    const s = ["Election Commission of India — public guidelines"];
    if (breakdown.hasState) s.push("State-specific electoral data");
    if (breakdown.hasProcess) s.push("Indian election procedure documentation");
    if (structured?.official_links?.length) s.push("Official resource links provided");
    return s;
  }, [breakdown, structured]);

  return (
    <Collapsible>
      <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition text-xs font-sans text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring group">
        <span className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" />
          AI Transparency & Metadata
        </span>
        <ChevronDown className="w-3.5 h-3.5 transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-4 rounded-xl border bg-card space-y-3"
        >
          {/* Confidence */}
          <div className="flex items-start gap-2">
            <Shield className={`w-4 h-4 mt-0.5 ${levelConfig.color}`} />
            <div>
              <span className={`text-xs font-medium font-sans ${levelConfig.color}`}>{levelConfig.label}</span>
              {isOpinionSensitive && (
                <p className="text-[10px] text-muted-foreground font-sans flex items-center gap-1 mt-0.5">
                  <AlertTriangle className="w-3 h-3" /> Reduced: query appears opinion-sensitive
                </p>
              )}
              <ul className="text-[10px] text-muted-foreground font-sans mt-1 space-y-0.5">
                {breakdown.reasons.map((r, i) => <li key={i}>• {r}</li>)}
              </ul>
            </div>
          </div>

          {/* Sources */}
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 mt-0.5 text-accent" />
            <div>
              <span className="text-xs font-medium font-sans text-foreground">Sources Referenced</span>
              <ul className="text-[10px] text-muted-foreground font-sans mt-0.5 space-y-0.5">
                {sources.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
          </div>

          {/* Recency */}
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5 text-civic-gold" />
            <div>
              <span className="text-xs font-medium font-sans text-foreground">Data Recency</span>
              <p className="text-[10px] text-muted-foreground font-sans">
                Based on latest available election data (up to 2024–25 cycles). May not reflect ongoing election updates.
              </p>
            </div>
          </div>

          {/* Scope */}
          <div className={`text-[10px] font-sans px-2 py-1 rounded ${levelConfig.bg} ${levelConfig.color}`}>
            Scope: Educational / Informational · No predictions · No endorsements
          </div>
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
});

export default AITransparencyPanel;
