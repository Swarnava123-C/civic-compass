import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOTING_STEPS } from "@/data/civicContent";

const VotingGuide = memo(function VotingGuide() {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = useCallback((index: number) => {
    setActiveStep(index);
  }, []);

  const step = VOTING_STEPS[activeStep];

  return (
    <section className="py-16 px-4 bg-muted/30" aria-labelledby="guide-heading">
      <div className="container max-w-4xl mx-auto">
        <h2 id="guide-heading" className="text-3xl font-bold text-foreground mb-2 text-center">
          Step-by-Step Voting Guide
        </h2>
        <p className="text-muted-foreground text-center mb-10 font-sans">
          Follow the process from registration to results
        </p>

        {/* Step indicators */}
        <nav className="flex justify-center gap-2 mb-8 flex-wrap" aria-label="Voting guide steps">
          {VOTING_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleStepChange(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium font-sans transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                i === activeStep
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-secondary border"
              }`}
              aria-current={i === activeStep ? "step" : undefined}
              aria-label={`Step ${i + 1}: ${s.title}`}
            >
              <span aria-hidden="true">{s.icon}</span> {s.title}
            </button>
          ))}
        </nav>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="civic-card p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl" aria-hidden="true">{step.icon}</span>
              <div>
                <h3 className="text-xl font-semibold text-foreground font-sans">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-sans">{step.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 font-sans flex items-center gap-2">
                  <span className="civic-badge-info">Official</span>
                  Responsibilities
                </h4>
                <ul className="space-y-2" aria-label="Official responsibilities">
                  {step.responsibilities.map((r) => (
                    <li key={r} className="text-sm text-foreground/80 flex items-start gap-2 font-sans">
                      <span className="text-civic-sky mt-0.5" aria-hidden="true">▸</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 font-sans flex items-center gap-2">
                  <span className="civic-badge-success">You</span>
                  Your Actions
                </h4>
                <ul className="space-y-2" aria-label="Your actions">
                  {step.userActions.map((a) => (
                    <li key={a} className="text-sm text-foreground/80 flex items-start gap-2 font-sans">
                      <span className="text-civic-success mt-0.5" aria-hidden="true">▸</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="mt-6 flex items-center gap-1" role="progressbar" aria-valuenow={activeStep + 1} aria-valuemin={1} aria-valuemax={VOTING_STEPS.length} aria-label="Voting guide progress">
          {VOTING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= activeStep ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default VotingGuide;
