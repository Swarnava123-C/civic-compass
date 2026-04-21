import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, ExternalLink, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { StructuredAIResponse, ConfidenceBreakdown } from "@/types/civic";

interface CitationsPanelProps {
  query: string;
  structured?: StructuredAIResponse | null;
  breakdown: ConfidenceBreakdown;
}

interface Citation {
  title: string;
  source: string;
  url?: string;
  relevance: "primary" | "supporting";
}

const INDIA_CITATIONS: Citation[] = [
  { title: "Representation of the People Act, 1950", source: "Legislative Document", url: "https://legislative.gov.in/actsofparliamentfromtheyear/representation-people-act-1950", relevance: "primary" },
  { title: "Representation of the People Act, 1951", source: "Legislative Document", url: "https://legislative.gov.in/actsofparliamentfromtheyear/representation-people-act-1951", relevance: "primary" },
  { title: "Election Commission of India — Voter Guidelines", source: "ECI Official", url: "https://eci.gov.in", relevance: "primary" },
  { title: "NVSP — National Voter Services Portal", source: "Government Portal", url: "https://www.nvsp.in", relevance: "supporting" },
  { title: "Constitution of India — Part XV (Elections)", source: "Constitutional Reference", url: "https://legislative.gov.in/constitution-of-india/", relevance: "primary" },
  { title: "Model Code of Conduct", source: "ECI Guidelines", url: "https://eci.gov.in/mcc", relevance: "supporting" },
  { title: "EVM & VVPAT Technical Guidelines", source: "ECI Technical", relevance: "supporting" },
  { title: "Delimitation Commission of India", source: "Government Body", url: "https://legislative.gov.in", relevance: "supporting" },
];

const TOPIC_KEYWORDS: Record<string, string[]> = {
  "registration": ["Representation of the People Act, 1950", "NVSP", "Election Commission of India"],
  "voting": ["Representation of the People Act, 1951", "EVM & VVPAT", "Election Commission of India"],
  "evm": ["EVM & VVPAT Technical Guidelines", "Election Commission of India"],
  "constituency": ["Delimitation Commission of India", "Constitution of India"],
  "model code": ["Model Code of Conduct", "Election Commission of India"],
  "candidate": ["Representation of the People Act, 1951", "Election Commission of India"],
  "election": ["Constitution of India", "Election Commission of India", "Representation of the People Act, 1951"],
  "turnout": ["Election Commission of India", "NVSP"],
  "id": ["NVSP", "Election Commission of India"],
  "epic": ["NVSP", "Election Commission of India"],
};

const CitationsPanel = memo(function CitationsPanel({ query, structured, breakdown }: CitationsPanelProps) {
  const citations = useMemo(() => {
    const queryLower = query.toLowerCase();
    const matchedTitles = new Set<string>();

    for (const [keyword, titles] of Object.entries(TOPIC_KEYWORDS)) {
      if (queryLower.includes(keyword)) {
        titles.forEach((t) => matchedTitles.add(t));
      }
    }

    // Always include ECI and Constitution
    matchedTitles.add("Election Commission of India — Voter Guidelines");
    matchedTitles.add("Constitution of India — Part XV (Elections)");

    if (breakdown.hasState) {
      matchedTitles.add("NVSP — National Voter Services Portal");
    }

    if (structured?.official_links?.length) {
      matchedTitles.add("NVSP — National Voter Services Portal");
    }

    return INDIA_CITATIONS.filter((c) =>
      matchedTitles.has(c.title) || Array.from(matchedTitles).some((t) => c.title.includes(t))
    );
  }, [query, structured, breakdown]);

  if (citations.length === 0) return null;

  return (
    <Collapsible>
      <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition text-xs font-sans text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring group">
        <span className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5" />
          Citations & India-Specific Sources ({citations.length})
        </span>
        <ChevronDown className="w-3.5 h-3.5 transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-4 rounded-xl border bg-card space-y-2"
        >
          {citations.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-xs font-sans">
              <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${c.relevance === "primary" ? "bg-accent" : "bg-muted-foreground/40"}`} />
              <div className="flex-1">
                <span className="text-foreground font-medium">{c.title}</span>
                <span className="text-muted-foreground ml-1.5">— {c.source}</span>
              </div>
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline shrink-0"
                  aria-label={`Open ${c.title}`}
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground pt-2 border-t">
            Sources are matched algorithmically from public Indian legislative and ECI records. No API keys are exposed.
          </p>
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
});

export default CitationsPanel;
