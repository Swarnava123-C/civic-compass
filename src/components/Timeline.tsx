import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIMELINE_STAGES } from "@/data/civicContent";

const Timeline = memo(function Timeline() {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const handleStageClick = useCallback((stageId: string) => {
    setActiveStage((prev) => (prev === stageId ? null : stageId));
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

  return (
    <section className="py-16 px-4" aria-labelledby="timeline-heading">
      <div className="container max-w-4xl mx-auto">
        <h2 id="timeline-heading" className="text-3xl font-bold text-foreground mb-2 text-center">
          Election Timeline
        </h2>
        <p className="text-muted-foreground text-center mb-10 font-sans">
          Click each stage to explore the election process in depth
        </p>

        {/* Horizontal step indicators */}
        <div className="hidden md:flex items-center justify-between mb-8 px-4" aria-hidden="true">
          {TIMELINE_STAGES.map((stage, index) => (
            <div key={stage.id} className="flex items-center flex-1">
              <button
                onClick={() => handleStageClick(stage.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold font-sans transition-all duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-ring ${
                  activeStage === stage.id
                    ? "bg-primary border-primary text-primary-foreground scale-110"
                    : "bg-card border-border text-muted-foreground hover:border-primary"
                }`}
                tabIndex={-1}
              >
                {stage.icon}
              </button>
              {index < TIMELINE_STAGES.length - 1 && (
                <div className="flex-1 h-0.5 bg-border mx-1" />
              )}
            </div>
          ))}
        </div>

        <div className="relative" role="list" aria-label="Election timeline stages">
          {TIMELINE_STAGES.map((stage, index) => {
            const isActive = activeStage === stage.id;
            return (
              <div key={stage.id} className="relative mb-4" role="listitem">
                <div
                  className={`civic-card p-5 cursor-pointer transition-all duration-200 ${
                    isActive ? "ring-2 ring-primary shadow-lg" : ""
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
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        {/* What happens */}
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-semibold text-foreground font-sans mb-2 flex items-center gap-1">
                                <span aria-hidden="true">📋</span> What Happens
                              </h4>
                              <ul className="space-y-1" aria-label={`Details for ${stage.title}`}>
                                {stage.details.map((detail) => (
                                  <li key={detail} className="text-sm text-foreground/80 flex items-start gap-2 font-sans">
                                    <span className="text-primary mt-0.5" aria-hidden="true">•</span>
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
                              <div className="p-3 rounded-lg bg-primary/5">
                                <h4 className="text-xs font-semibold text-foreground font-sans mb-1 flex items-center gap-1">
                                  <span aria-hidden="true">⚖️</span> Legal Significance
                                </h4>
                                <p className="text-xs text-muted-foreground font-sans">{stage.legalSignificance}</p>
                              </div>
                            )}

                            {stage.citizenRole && (
                              <div className="p-3 rounded-lg bg-accent/5">
                                <h4 className="text-xs font-semibold text-foreground font-sans mb-1 flex items-center gap-1">
                                  <span aria-hidden="true">🙋</span> Your Role
                                </h4>
                                <p className="text-xs text-muted-foreground font-sans">{stage.citizenRole}</p>
                              </div>
                            )}
                          </div>

                          {stage.requiredDocuments && stage.requiredDocuments.length > 0 && (
                            <div className="mt-3 p-3 rounded-lg bg-secondary/50">
                              <h4 className="text-xs font-semibold text-foreground font-sans mb-1 flex items-center gap-1">
                                <span aria-hidden="true">📂</span> Required Documents
                              </h4>
                              <ul className="space-y-0.5">
                                {stage.requiredDocuments.map((doc) => (
                                  <li key={doc} className="text-xs text-muted-foreground font-sans flex items-start gap-1.5">
                                    <span className="text-primary mt-0.5" aria-hidden="true">•</span>{doc}
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default Timeline;
