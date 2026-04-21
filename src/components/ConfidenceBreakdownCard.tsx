import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Info } from "lucide-react";
import type { ConfidenceBreakdown } from "@/types/civic";

interface ConfidenceBreakdownCardProps {
  breakdown: ConfidenceBreakdown;
}

const ConfidenceBreakdownCard = memo(function ConfidenceBreakdownCard({ breakdown }: ConfidenceBreakdownCardProps) {
  const config = useMemo(() => {
    switch (breakdown.level) {
      case "high":
        return {
          color: "hsl(var(--civic-success))",
          bg: "bg-civic-success/5",
          border: "border-civic-success/20",
          icon: Shield,
          label: "High Confidence",
          percent: 95,
        };
      case "medium":
        return {
          color: "hsl(var(--civic-amber))",
          bg: "bg-civic-amber/5",
          border: "border-civic-amber/20",
          icon: Info,
          label: "Medium Confidence",
          percent: 60,
        };
      default:
        return {
          color: "hsl(var(--civic-gold))",
          bg: "bg-civic-gold/5",
          border: "border-civic-gold/20",
          icon: AlertTriangle,
          label: "Low Confidence",
          percent: 30,
        };
    }
  }, [breakdown.level]);

  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-4 ${config.bg} ${config.border}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color: config.color }} />
        <span className="text-sm font-semibold font-sans text-foreground">{config.label}</span>
      </div>

      {/* Animated bar */}
      <div className="h-2 rounded-full bg-muted/50 overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: config.color }}
          initial={{ width: 0 }}
          animate={{ width: `${config.percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Reasons */}
      <ul className="space-y-1">
        {breakdown.reasons.map((reason, i) => (
          <li key={i} className="text-xs text-muted-foreground font-sans flex items-start gap-1.5">
            <span className="mt-0.5" style={{ color: config.color }} aria-hidden="true">•</span>
            {reason}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex gap-3 text-[10px] font-sans text-muted-foreground">
        <span className={breakdown.hasState ? "text-foreground font-medium" : ""}>
          {breakdown.hasState ? "✓" : "○"} State selected
        </span>
        <span className={breakdown.hasProcess ? "text-foreground font-medium" : ""}>
          {breakdown.hasProcess ? "✓" : "○"} Process identified
        </span>
      </div>
    </div>
  );
});

export default ConfidenceBreakdownCard;
