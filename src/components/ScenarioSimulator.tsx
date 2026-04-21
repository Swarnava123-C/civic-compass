import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SCENARIOS } from "@/data/scenarioData";
import type { Scenario } from "@/types/civic";

const ScenarioSimulator = memo(function ScenarioSimulator() {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);

  const handleSelect = useCallback((scenario: Scenario) => {
    setActiveScenario((prev) => (prev?.id === scenario.id ? null : scenario));
  }, []);

  return (
    <section className="py-16 px-4 bg-muted/30" aria-labelledby="simulator-heading">
      <div className="container max-w-4xl mx-auto">
        <h2 id="simulator-heading" className="text-3xl font-bold text-foreground mb-2 text-center">
          What Happens If I…
        </h2>
        <p className="text-muted-foreground text-center mb-8 font-sans">
          Select a scenario to see step-by-step guidance
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleSelect(scenario)}
              className={`civic-card p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring ${
                activeScenario?.id === scenario.id ? "ring-2 ring-primary shadow-lg" : ""
              }`}
              aria-pressed={activeScenario?.id === scenario.id}
              aria-label={`Scenario: ${scenario.title}`}
            >
              <span className="text-2xl block mb-2" aria-hidden="true">{scenario.icon}</span>
              <h3 className="text-sm font-semibold text-foreground font-sans">{scenario.title}</h3>
              <p className="text-xs text-muted-foreground font-sans mt-1">{scenario.description}</p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeScenario && (
            <motion.div
              key={activeScenario.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="civic-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl" aria-hidden="true">{activeScenario.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-foreground font-sans">{activeScenario.title}</h3>
                  <p className="text-sm text-muted-foreground font-sans">{activeScenario.description}</p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-semibold text-foreground font-sans flex items-center gap-2">
                  <span aria-hidden="true">📝</span> Action Steps
                </h4>
                {activeScenario.steps.map((step) => (
                  <div key={step.step} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold font-sans">
                      {step.step}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground font-sans">{step.title}</p>
                      <p className="text-xs text-muted-foreground font-sans">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Required Forms */}
                {activeScenario.requiredForms && activeScenario.requiredForms.length > 0 && (
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1">
                      <span aria-hidden="true">📂</span> Required Documents
                    </h4>
                    <ul className="space-y-1">
                      {activeScenario.requiredForms.map((form) => (
                        <li key={form} className="text-xs text-muted-foreground font-sans flex items-start gap-1.5">
                          <span className="text-primary mt-0.5" aria-hidden="true">•</span>{form}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Deadlines */}
                {activeScenario.deadlines && (
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1">
                      <span aria-hidden="true">📅</span> Deadlines
                    </h4>
                    <p className="text-xs text-muted-foreground font-sans">{activeScenario.deadlines}</p>
                  </div>
                )}

                {/* Where to Apply */}
                {activeScenario.whereToApply && (
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1">
                      <span aria-hidden="true">📍</span> Where to Apply
                    </h4>
                    <p className="text-xs text-muted-foreground font-sans">{activeScenario.whereToApply}</p>
                  </div>
                )}

                {/* Warnings */}
                {activeScenario.warnings && activeScenario.warnings.length > 0 && (
                  <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1">
                      <span aria-hidden="true">⚠️</span> Important Warnings
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

              {/* Official Resources */}
              {activeScenario.officialResources && activeScenario.officialResources.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-primary/5">
                  <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1">
                    <span aria-hidden="true">🔗</span> Official Resources
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeScenario.officialResources.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-sans focus:outline-none focus:ring-2 focus:ring-ring rounded"
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
