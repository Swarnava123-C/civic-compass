import { useState, useCallback, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIMELINE_STAGES } from "@/data/civicContent";
import { Check } from "lucide-react";

const Timeline = memo(function Timeline() {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [visitedStages, setVisitedStages] = useState<Set<string>>(new Set());

  const handleStageClick = useCallback((stageId: string) => {
    setActiveStage((prev) => (prev === stageId ? null : stageId));
    setVisitedStages((prev) => new Set(prev).add(stageId));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, stageId: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleStageClick(stageId);
      }
    },
    [handleStageClick]
  );

  const activeIndex = useMemo(
    () => TIMELINE_STAGES.findIndex((s) => s.id === activeStage),
    [activeStage]
  );

  return (
    <section className="py-20 px-4" aria-labelledby="timeline-heading">
      <div className="container max-w-4xl mx-auto">
        <h2 id="timeline-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
          Election Timeline
        </h2>
        <p className="text-muted-foreground text-center mb-12 font-sans">
          Click each stage to explore the election process in depth
        </p>

        {/* Horizontal stepper */}
        <div className="hidden md:flex items-center justify-between mb-10 px-2" aria-hidden="true">
          {TIMELINE_STAGES.map((stage, index) => {
            const isActive = activeStage === stage.id;
            const isVisited = visitedStages.has(stage.id);
            const isBeforeActive = activeIndex >= 0 && index < activeIndex;
            return (
              <div key={stage.id} className="flex items-center flex-1">
                <button
                  onClick={() => handleStageClick(stage.id)}
                  className={`relative w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold font-sans transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-ring ${
                    isActive
                      ? "bg-accent border-accent text-accent-foreground scale-110 shadow-lg"
                      : isVisited
                      ? "bg-civic-success/10 border-civic-success text-civic-success"
                      : "bg-card border-border text-muted-foreground hover:border-accent/50"
                  }`}
                  tabIndex={-1}
                >
                  {isVisited && !isActive ? <Check className="w-4 h-4" /> : stage.icon}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-accent"
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.3, opacity: 0 }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </button>
                {index < TIMELINE_STAGES.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 rounded-full overflow-hidden bg-border">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: "0%" }}
                      animate={{ width: isBeforeActive || isActive ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="relative" role="list" aria-label="Election timeline stages">
          {TIMELINE_STAGES.map((stage, index) => {
            const isActive = activeStage === stage.id;
            return (
              <motion.div
                key={stage.id}
                className="relative mb-4"
                role="listitem"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={`civic-card-hover p-5 cursor-pointer ${
                    isActive ? "ring-2 ring-accent shadow-lg civic-glow-primary" : ""
                  }`}
                  onClick={() => handleStageClick(stage.id)}
                  onKeyDown={(e) => handleKeyDown(e, stage.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  aria-label={`${stage.title} stage — ${stage.description}`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl" aria-hidden="true">{stage.icon}</span>
                    <span className="civic-badge-info font-sans">Step {index + 1}</span>
                    <span className="text-xs text-muted-foreground font-sans">{stage.duration}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mt-2 font-sans">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground font-sans">{stage.description}</p>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1">
                                <span aria-hidden="true">📋</span> What Happens
                              </h4>
                              <ul className="space-y-1" aria-label={`Details for ${stage.title}`}>
                                {stage.details.map((detail) => (
                                  <li key={detail} className="text-sm text-foreground/80 flex items-start gap-2 font-sans">
                                    <span className="text-accent mt-0.5" aria-hidden="true">•</span>
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {stage.whoIsInvolved && (
                              <div>
                                <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1">
                                  <span aria-hidden="true">👥</span> Who Is Involved
                                </h4>
                                <ul className="space-y-1">
                                  {stage.whoIsInvolved.map((who) => (
                                    <li key={who} className="text-sm text-foreground/80 flex items-start gap-2 font-sans">
                                      <span className="text-accent mt-0.5" aria-hidden="true">•</span>
                                      {who}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-3">
                            {stage.legalSignificance && (
                              <div className="p-3 rounded-xl bg-accent/5 border border-accent/10">
                                <h4 className="text-xs font-semibold text-foreground font-sans mb-1 flex items-center gap-1">
                                  <span aria-hidden="true">⚖️</span> Legal Significance
                                </h4>
                                <p className="text-xs text-muted-foreground font-sans">{stage.legalSignificance}</p>
                              </div>
                            )}

                            {stage.citizenRole && (
                              <div className="p-3 rounded-xl bg-civic-success/5 border border-civic-success/10">
                                <h4 className="text-xs font-semibold text-foreground font-sans mb-1 flex items-center gap-1">
                                  <span aria-hidden="true">🙋</span> Your Role
                                </h4>
                                <p className="text-xs text-muted-foreground font-sans">{stage.citizenRole}</p>
                              </div>
                            )}
                          </div>

                          {stage.requiredDocuments && stage.requiredDocuments.length > 0 && (
                            <div className="mt-3 p-3 rounded-xl bg-secondary/50">
                              <h4 className="text-xs font-semibold text-foreground font-sans mb-1 flex items-center gap-1">
                                <span aria-hidden="true">📂</span> Required Documents
                              </h4>
                              <ul className="space-y-0.5">
                                {stage.requiredDocuments.map((doc) => (
                                  <li key={doc} className="text-xs text-muted-foreground font-sans flex items-start gap-1.5">
                                    <span className="text-accent mt-0.5" aria-hidden="true">•</span>{doc}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default Timeline;
