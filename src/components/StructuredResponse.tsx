import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Info, AlertTriangle } from "lucide-react";
import type { StructuredAIResponse } from "@/types/civic";

interface StructuredResponseProps {
  data: StructuredAIResponse;
}

const StructuredResponse = memo(function StructuredResponse({ data }: StructuredResponseProps) {
  const confidenceConfig = (score?: string) => {
    if (!score) return null;
    const lower = score.toLowerCase();
    if (lower.includes("high")) return { color: "hsl(var(--civic-success))", bg: "bg-civic-success/10", label: "High", icon: Shield, percent: 95 };
    if (lower.includes("medium")) return { color: "hsl(var(--civic-amber))", bg: "bg-civic-amber/10", label: "Medium", icon: Info, percent: 60 };
    return { color: "hsl(var(--civic-gold))", bg: "bg-civic-gold/10", label: "Low", icon: AlertTriangle, percent: 30 };
  };

  const conf = confidenceConfig(data.confidence_score);

  return (
    <div className="space-y-3 text-sm font-sans">
      {data.summary && (
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
            <span aria-hidden="true">📌</span> Summary
          </h4>
          <p className="text-muted-foreground">{data.summary}</p>
        </div>
      )}

      {data.timeline_stage && (
        <div className="flex items-center gap-2">
          <span aria-hidden="true">📅</span>
          <span className="civic-badge-info text-[10px]">{data.timeline_stage}</span>
        </div>
      )}

      {data.steps && data.steps.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
            <span aria-hidden="true">📝</span> Action Steps
          </h4>
          <ol className="space-y-1 ml-4 list-decimal">
            {data.steps.map((s, i) => (
              <li key={i} className="text-xs text-muted-foreground">{s}</li>
            ))}
          </ol>
        </div>
      )}

      {data.documents_required && data.documents_required.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
            <span aria-hidden="true">📂</span> Required Documents
          </h4>
          <ul className="space-y-0.5">
            {data.documents_required.map((d, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-accent mt-0.5" aria-hidden="true">•</span>{d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.eligibility_rules && data.eligibility_rules.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
            <span aria-hidden="true">⚖️</span> Eligibility
          </h4>
          <ul className="space-y-0.5">
            {data.eligibility_rules.map((r, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-accent mt-0.5" aria-hidden="true">•</span>{r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.deadlines && (
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
            <span aria-hidden="true">⏰</span> Deadlines
          </h4>
          <p className="text-xs text-muted-foreground">{data.deadlines}</p>
        </div>
      )}

      {data.warnings && data.warnings.length > 0 && (
        <div className="p-2.5 rounded-xl bg-destructive/5 border border-destructive/20">
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
            <span aria-hidden="true">⚠️</span> Important Notes
          </h4>
          <ul className="space-y-0.5">
            {data.warnings.map((w, i) => (
              <li key={i} className="text-xs text-muted-foreground">{w}</li>
            ))}
          </ul>
        </div>
      )}

      {data.official_links && data.official_links.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
            <span aria-hidden="true">🔗</span> Official Resources
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.official_links.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
              >
                {url.replace(/^https?:\/\//, "").split("/")[0]}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Animated confidence gauge */}
      {conf && (
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-1">
            <conf.icon className="w-3 h-3" style={{ color: conf.color }} />
            <span className="text-[10px] font-semibold font-sans text-foreground">{conf.label} Confidence</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: conf.color }}
              initial={{ width: 0 }}
              animate={{ width: `${conf.percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default StructuredResponse;
