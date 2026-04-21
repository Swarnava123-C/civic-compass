import { memo } from "react";
import type { StructuredAIResponse } from "@/types/civic";

interface StructuredResponseProps {
  data: StructuredAIResponse;
}

const StructuredResponse = memo(function StructuredResponse({ data }: StructuredResponseProps) {
  const confidenceColor = (score?: string) => {
    if (!score) return "";
    const lower = score.toLowerCase();
    if (lower.includes("high")) return "civic-badge-success";
    if (lower.includes("medium")) return "civic-badge-info";
    return "civic-badge-gold";
  };

  return (
    <div className="space-y-3 text-sm font-sans">
      {/* Summary */}
      {data.summary && (
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
            <span aria-hidden="true">📌</span> Summary
          </h4>
          <p className="text-muted-foreground">{data.summary}</p>
        </div>
      )}

      {/* Timeline Stage */}
      {data.timeline_stage && (
        <div className="flex items-center gap-2">
          <span aria-hidden="true">📅</span>
          <span className="civic-badge-info text-[10px]">{data.timeline_stage}</span>
        </div>
      )}

      {/* Steps */}
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

      {/* Documents */}
      {data.documents_required && data.documents_required.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
            <span aria-hidden="true">📂</span> Required Documents
          </h4>
          <ul className="space-y-0.5">
            {data.documents_required.map((d, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-primary mt-0.5" aria-hidden="true">•</span>{d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Eligibility */}
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

      {/* Deadlines */}
      {data.deadlines && (
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
            <span aria-hidden="true">⏰</span> Deadlines
          </h4>
          <p className="text-xs text-muted-foreground">{data.deadlines}</p>
        </div>
      )}

      {/* Warnings */}
      {data.warnings && data.warnings.length > 0 && (
        <div className="p-2 rounded bg-destructive/5 border border-destructive/20">
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

      {/* Official Links */}
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
                className="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
              >
                {url.replace(/^https?:\/\//, "").split("/")[0]}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Confidence */}
      {data.confidence_score && (
        <div className="pt-1">
          <span className={`${confidenceColor(data.confidence_score)} text-[10px]`}>
            {data.confidence_score} confidence
          </span>
        </div>
      )}
    </div>
  );
});

export default StructuredResponse;
