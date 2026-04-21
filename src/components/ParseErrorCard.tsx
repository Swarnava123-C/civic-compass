import { memo } from "react";
import { AlertTriangle } from "lucide-react";

interface ParseErrorCardProps {
  errors: string[];
  fallbackContent?: string;
}

const ParseErrorCard = memo(function ParseErrorCard({ errors, fallbackContent }: ParseErrorCardProps) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-destructive" />
        <span className="text-sm font-semibold text-foreground font-sans">Response Format Issue</span>
      </div>
      <p className="text-xs text-muted-foreground font-sans">
        The AI response didn't match the expected format. Here's what we know:
      </p>
      {fallbackContent && (
        <div className="p-3 rounded-lg bg-card border text-xs text-foreground font-sans whitespace-pre-wrap">
          {fallbackContent}
        </div>
      )}
      <details className="text-xs text-muted-foreground font-sans">
        <summary className="cursor-pointer hover:text-foreground transition">Technical details</summary>
        <ul className="mt-2 space-y-1 ml-4">
          {errors.map((err, i) => (
            <li key={i} className="list-disc">{err}</li>
          ))}
        </ul>
      </details>
    </div>
  );
});

export default ParseErrorCard;
