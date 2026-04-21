import { useState, useCallback, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUIZ_QUESTIONS } from "@/data/civicContent";

const CivicQuiz = memo(function CivicQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentQ];
  const total = QUIZ_QUESTIONS.length;

  const progress = useMemo(() => ((currentQ + (finished ? 1 : 0)) / total) * 100, [currentQ, finished, total]);

  const handleSelect = useCallback(
    (index: number) => {
      if (answered) return;
      setSelected(index);
      setAnswered(true);
      if (index === question.correctIndex) {
        setScore((s) => s + 1);
      }
    },
    [answered, question.correctIndex]
  );

  const handleNext = useCallback(() => {
    if (currentQ + 1 >= total) {
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  }, [currentQ, total]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  }, []);

  return (
    <section className="py-16 px-4" aria-labelledby="quiz-heading">
      <div className="container max-w-2xl mx-auto">
        <h2 id="quiz-heading" className="text-3xl font-bold text-foreground mb-2 text-center">
          Civic Quiz
        </h2>
        <p className="text-muted-foreground text-center mb-8 font-sans">
          Test your knowledge of elections and civic processes
        </p>

        {/* Progress */}
        <div className="w-full bg-border rounded-full h-2 mb-6" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Quiz progress">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {finished ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="civic-card p-8 text-center"
          >
            <span className="text-5xl mb-4 block" aria-hidden="true">🎉</span>
            <h3 className="text-2xl font-bold text-foreground font-sans mb-2">Quiz Complete!</h3>
            <p className="text-lg text-muted-foreground font-sans mb-4">
              You scored <strong className="text-foreground">{score}</strong> out of <strong className="text-foreground">{total}</strong>
            </p>
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium font-sans transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Restart quiz"
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="civic-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="civic-badge-info font-sans">Question {currentQ + 1}/{total}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground font-sans mb-5">{question.question}</h3>

              <div className="space-y-2" role="radiogroup" aria-label="Answer options">
                {question.options.map((opt, i) => {
                  let optClass = "bg-card border text-foreground hover:bg-secondary";
                  if (answered) {
                    if (i === question.correctIndex) optClass = "bg-civic-success/10 border-civic-success text-foreground";
                    else if (i === selected) optClass = "bg-destructive/10 border-destructive text-foreground";
                    else optClass = "bg-card border text-muted-foreground opacity-60";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={answered}
                      className={`w-full text-left p-3 rounded-lg text-sm font-sans transition border focus:outline-none focus:ring-2 focus:ring-ring ${optClass}`}
                      role="radio"
                      aria-checked={selected === i}
                      aria-label={opt}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground font-sans"
                >
                  <strong>Explanation:</strong> {question.explanation}
                  <div className="mt-3 text-right">
                    <button
                      onClick={handleNext}
                      className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium font-sans transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                      aria-label={currentQ + 1 >= total ? "See results" : "Next question"}
                    >
                      {currentQ + 1 >= total ? "See Results" : "Next →"}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
});

export default CivicQuiz;
