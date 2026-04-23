import { useState, useCallback, useMemo, memo } from "react";
import { trackQuizComplete } from "@/utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { QUIZ_QUESTIONS } from "@/data/civicContent";

interface CivicQuizProps {
  onComplete?: (score: number, total: number) => void;
}

const CivicQuiz = memo(function CivicQuiz({ onComplete }: CivicQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentQ];
  const progress = useMemo(
    () => (finished ? 100 : (currentQ / QUIZ_QUESTIONS.length) * 100),
    [currentQ, finished]
  );

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
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
      onComplete?.(score, QUIZ_QUESTIONS.length);
      trackQuizComplete(score, QUIZ_QUESTIONS.length);
    }
  }, [currentQ, score, onComplete]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  }, []);

  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  return (
    <section className="py-20 px-4 civic-gradient-subtle" aria-labelledby="quiz-heading">
      <div className="container max-w-2xl mx-auto">
        <h2 id="quiz-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
          Test Your Civic Knowledge
        </h2>
        <p className="text-muted-foreground text-center mb-10 font-sans">
          {QUIZ_QUESTIONS.length} questions — see how well you know the process
        </p>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-sans text-muted-foreground mb-1.5">
            <span>Question {Math.min(currentQ + 1, QUIZ_QUESTIONS.length)} of {QUIZ_QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="h-2 rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="h-full rounded-full bg-accent"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {finished ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="civic-card p-8 text-center"
          >
            <div className="relative w-28 h-28 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="hsl(var(--civic-success))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={264}
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * percentage) / 100 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground font-sans">{percentage}%</span>
              </div>
            </div>
            <Trophy className="w-8 h-8 mx-auto mb-3 text-civic-gold" />
            <h3 className="text-xl font-bold text-foreground font-sans mb-1">
              {score}/{QUIZ_QUESTIONS.length} Correct
            </h3>
            <p className="text-sm text-muted-foreground font-sans mb-6">
              {percentage >= 80 ? "Outstanding civic knowledge!" : percentage >= 50 ? "Good work — keep learning!" : "Review the modules above and try again!"}
            </p>
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium font-sans transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="civic-card p-6"
            >
              <h3 className="text-lg font-semibold text-foreground font-sans mb-5">{question.question}</h3>

              <div className="space-y-2 mb-5">
                {question.options.map((option, idx) => {
                  const isCorrect = idx === question.correctIndex;
                  const isSelected = idx === selected;
                  let optionClass = "bg-card border text-foreground hover:bg-muted/50";
                  if (answered) {
                    if (isCorrect) optionClass = "bg-civic-success/10 border-civic-success text-foreground";
                    else if (isSelected) optionClass = "bg-destructive/10 border-destructive text-foreground";
                    else optionClass = "bg-card border text-muted-foreground opacity-60";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={answered}
                      className={`w-full p-3.5 rounded-xl text-left text-sm font-sans transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-ring border ${optionClass}`}
                      role="radio"
                      aria-checked={isSelected}
                    >
                      <span className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-semibold">
                        {answered && isCorrect ? <CheckCircle2 className="w-4 h-4 text-civic-success" /> :
                         answered && isSelected ? <XCircle className="w-4 h-4 text-destructive" /> :
                         String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-accent/5 border border-accent/10"
                >
                  <p className="text-xs text-muted-foreground font-sans">
                    <strong className="text-foreground">Explanation:</strong> {question.explanation}
                  </p>
                </motion.div>
              )}

              {answered && (
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium font-sans transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {currentQ < QUIZ_QUESTIONS.length - 1 ? (
                      <>Next <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      "See Results"
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
});

export default CivicQuiz;
