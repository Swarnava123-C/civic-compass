import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Building2, RefreshCw } from "lucide-react";
import { GOVERNMENT_BRANCHES } from "@/data/governmentData";

const GovernmentStructure = memo(function GovernmentStructure() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleBranch = useCallback((id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleBranch(id);
      }
    },
    [toggleBranch]
  );

  return (
    <section className="py-20 px-4" aria-labelledby="gov-heading">
      <div className="container max-w-4xl mx-auto">
        <h2 id="gov-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
          Government Structure
        </h2>
        <p className="text-muted-foreground text-center mb-10 font-sans">
          The three branches of the U.S. federal government and how they check each other
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {GOVERNMENT_BRANCHES.map((branch, i) => {
            const isExpanded = expanded === branch.id;
            return (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`civic-card-hover p-5 cursor-pointer ${
                  isExpanded ? "ring-2 ring-accent shadow-lg md:col-span-3 civic-glow-primary" : ""
                }`}
                onClick={() => toggleBranch(branch.id)}
                onKeyDown={(e) => handleKeyDown(e, branch.id)}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={`${branch.name} — ${branch.role}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-xl">
                    {branch.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground font-sans">{branch.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground font-sans">{branch.role}</p>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                        <div>
                          <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-accent" /> Powers
                          </h4>
                          <ul className="space-y-1">
                            {branch.powers.map((p) => (
                              <li key={p} className="text-xs text-muted-foreground font-sans flex items-start gap-1.5">
                                <span className="text-accent mt-0.5" aria-hidden="true">•</span>{p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-accent" /> Examples
                          </h4>
                          <ul className="space-y-1">
                            {branch.examples.map((ex) => (
                              <li key={ex} className="text-xs text-muted-foreground font-sans flex items-start gap-1.5">
                                <span className="text-accent mt-0.5" aria-hidden="true">•</span>{ex}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5 text-civic-gold" /> Checks & Balances
                          </h4>
                          <ul className="space-y-1">
                            {branch.checksAndBalances.map((c) => (
                              <li key={c} className="text-xs text-muted-foreground font-sans flex items-start gap-1.5">
                                <span className="text-civic-gold mt-0.5" aria-hidden="true">•</span>{c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default GovernmentStructure;
