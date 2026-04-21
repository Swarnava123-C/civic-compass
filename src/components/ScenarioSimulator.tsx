import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clock, AlertTriangle, MapPin, ExternalLink } from "lucide-react";
import { SCENARIOS } from "@/data/scenarioData";
import type { Scenario } from "@/types/civic";

interface ScenarioSimulatorProps {
  onScenarioView?: (scenarioId: string) => void;
}

const ScenarioSimulator = memo(function ScenarioSimulator({ onScenarioView }: ScenarioSimulatorProps) {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  const handleSelect = useCallback((scenario: Scenario) => {
    setActiveScenario((prev) => (prev?.id === scenario.id ? null : scenario));
    onScenarioView?.(scenario.id);
  }, [onScenarioView]);

  return (
    <section className="py-20 px-4 civic-gradient-subtle" aria-labelledby="simulator-heading">
      <div className="container max-w-4xl mx-auto">
        <h2 id="simulator-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
          What Happens If I…
        </h2>
        <p className="text-muted-foreground text-center mb-10 font-sans">
          Select a scenario to see step-by-step guidance
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {SCENARIOS.map((scenario, i) => (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelect(scenario)}
              className={`civic-card-hover p-4 text-left focus:outline-none focus:ring-2 focus:ring-ring ${
                activeScenario?.id === scenario.id ? "ring-2 ring-accent shadow-lg civic-glow-primary" : ""
              }`}
              aria-pressed={activeScenario?.id === scenario.id}
              aria-label={`Scenario: ${scenario.title}`}
            >
              <span className="text-2xl block mb-2" aria-hidden="true">{scenario.icon}</span>
              <h3 className="text-sm font-semibold text-foreground font-sans">{scenario.title}</h3>
              <p className="text-xs text-muted-foreground font-sans mt-1">{scenario.description}</p>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeScenario && (
            <motion.div
              key={activeScenario.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="civic-card p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl" aria-hidden="true">{activeScenario.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-foreground font-sans">{activeScenario.title}</h3>
                  <p className="text-sm text-muted-foreground font-sans">{activeScenario.description}</p>
                </div>
              </div>

              {/* Steps with vertical flow */}
              <div className="relative mb-6 ml-4">
                <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-border" />
                {activeScenario.steps.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex gap-4 items-start mb-4"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-semibold font-sans z-10">
                      {step.step}
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-semibold text-foreground font-sans">{step.title}</p>
                      <p className="text-xs text-muted-foreground font-sans mt-0.5">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {activeScenario.requiredForms && activeScenario.requiredForms.length > 0 && (
                  <div className="p-3 rounded-xl bg-secondary/50">
                    <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-accent" /> Required Documents
                    </h4>
                    <ul className="space-y-1">
                      {activeScenario.requiredForms.map((form) => (
                        <li key={form} className="text-xs text-muted-foreground font-sans flex items-start gap-1.5">
                          <span className="text-accent mt-0.5" aria-hidden="true">•</span>{form}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeScenario.deadlines && (
                  <div className="p-3 rounded-xl bg-secondary/50">
                    <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-accent" /> Deadlines
                    </h4>
                    <p className="text-xs text-muted-foreground font-sans">{activeScenario.deadlines}</p>
                  </div>
                )}

                {activeScenario.whereToApply && (
                  <div className="p-3 rounded-xl bg-secondary/50">
                    <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-accent" /> Where to Apply
                    </h4>
                    <p className="text-xs text-muted-foreground font-sans">{activeScenario.whereToApply}</p>
                  </div>
                )}

                {activeScenario.warnings && activeScenario.warnings.length > 0 && (
                  <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20">
                    <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-destructive" /> Important Warnings
                    </h4>
                    <ul className="space-y-1">
                      {activeScenario.warnings.map((w) => (
                        <li key={w} className="text-xs text-muted-foreground font-sans flex items-start gap-1.5">
                          <span className="text-destructive mt-0.5" aria-hidden="true">!</span>{w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {activeScenario.officialResources && activeScenario.officialResources.length > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-accent/5 border border-accent/10">
                  <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-accent" /> Official Resources
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeScenario.officialResources.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline font-sans focus:outline-none focus:ring-2 focus:ring-ring rounded"
                        aria-label={`Visit ${url} (opens in new tab)`}
                      >
                        {url.replace(/^https?:\/\//, "")}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

export default ScenarioSimulator;
