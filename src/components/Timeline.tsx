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
          Click each stage to explore the election process
        </p>

        <div className="relative" role="list" aria-label="Election timeline stages">
          {/* Connector line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" aria-hidden="true" />

          {TIMELINE_STAGES.map((stage, index) => {
            const isActive = activeStage === stage.id;
            return (
              <div key={stage.id} className="relative mb-4" role="listitem">
                <div
                  className={`civic-card p-5 cursor-pointer ml-0 md:ml-14 transition-all duration-200 ${
                    isActive ? "ring-2 ring-primary shadow-lg" : ""
                  }`}
                  onClick={() => handleStageClick(stage.id)}
                  onKeyDown={(e) => handleKeyDown(e, stage.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  aria-label={`${stage.title} stage — ${stage.description}`}
                >
                  {/* Timeline dot */}
                  <div
                    className={`hidden md:flex absolute -left-14 top-5 w-10 h-10 rounded-full items-center justify-center text-lg border-2 transition-colors ${
                      isActive
                        ? "bg-primary border-primary"
                        : "bg-card border-border"
                    }`}
                    aria-hidden="true"
                  >
                    <span>{stage.icon}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-1">
                    <span className="md:hidden text-xl" aria-hidden="true">{stage.icon}</span>
                    <span className="civic-badge-info font-sans">Step {index + 1}</span>
                    <span className="text-xs text-muted-foreground font-sans">{stage.duration}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mt-2 font-sans">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground font-sans">{stage.description}</p>

                  <AnimatePresence>
                    {isActive && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-3 space-y-1 overflow-hidden"
                        aria-label={`Details for ${stage.title}`}
                      >
                        {stage.details.map((detail) => (
                          <li key={detail} className="text-sm text-foreground/80 flex items-start gap-2 font-sans">
                            <span className="text-civic-sky mt-0.5" aria-hidden="true">•</span>
                            {detail}
                          </li>
                        ))}
                      </motion.ul>
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
