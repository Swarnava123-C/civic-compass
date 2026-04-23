import { useState, useCallback, useMemo, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Award, RotateCcw, BookOpen } from "lucide-react";
import { LEARNING_LEVELS, type LearningModule } from "@/data/learningPathData";
import { Progress } from "@/components/ui/progress";

interface LearningState {
  completedModules: string[];
  moduleScores: Record<string, number>;
  badges: string[];
}

const STORAGE_KEY = "civicflow-learning-progress";

function loadProgress(): LearningState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { completedModules: [], moduleScores: {}, badges: [] };
}

function saveProgress(state: LearningState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

const LearningPath = memo(function LearningPath() {
  const [progress, setProgress] = useState<LearningState>(loadProgress);
  const [activeLevel, setActiveLevel] = useState<string>("beginner");
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [quizState, setQuizState] = useState<{ current: number; answers: (number | null)[]; showResult: boolean }>({ current: 0, answers: [], showResult: false });

  useEffect(() => { saveProgress(progress); }, [progress]);

  const currentLevel = useMemo(() => LEARNING_LEVELS.find((l) => l.id === activeLevel) ?? LEARNING_LEVELS[0], [activeLevel]);

  const levelProgress = useMemo(() => {
    const total = currentLevel.modules.length;
    const done = currentLevel.modules.filter((m) => progress.completedModules.includes(m.id)).length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [currentLevel, progress]);

  const totalProgress = useMemo(() => {
    const allModules = LEARNING_LEVELS.flatMap((l) => l.modules);
    const done = allModules.filter((m) => progress.completedModules.includes(m.id)).length;
    return allModules.length > 0 ? Math.round((done / allModules.length) * 100) : 0;
  }, [progress]);

  const startModule = useCallback((mod: LearningModule) => {
    setActiveModule(mod);
    setQuizState({ current: 0, answers: new Array(mod.quiz.length).fill(null), showResult: false });
  }, []);

  const answerQuestion = useCallback((answerIndex: number) => {
    setQuizState((prev) => {
      const answers = [...prev.answers];
      if (answers[prev.current] !== null) return prev;
      answers[prev.current] = answerIndex;
      return { ...prev, answers };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setQuizState((prev) => {
      if (prev.current + 1 >= (activeModule?.quiz.length ?? 0)) {
        return { ...prev, showResult: true };
      }
      return { ...prev, current: prev.current + 1 };
    });
  }, [activeModule]);

  const completeModule = useCallback(() => {
    if (!activeModule) return;
    const correct = quizState.answers.filter((a, i) => a === activeModule.quiz[i]?.correctIndex).length;
    const score = activeModule.quiz.length > 0 ? Math.round((correct / activeModule.quiz.length) * 100) : 100;

    setProgress((prev) => {
      const completedModules = prev.completedModules.includes(activeModule.id)
        ? prev.completedModules
        : [...prev.completedModules, activeModule.id];
      const moduleScores = { ...prev.moduleScores, [activeModule.id]: score };

      // Check badge eligibility
      const badges = [...prev.badges];
      for (const level of LEARNING_LEVELS) {
        const allDone = level.modules.every((m) => completedModules.includes(m.id));
        if (allDone && !badges.includes(level.badge)) {
          badges.push(level.badge);
        }
      }

      return { completedModules, moduleScores, badges };
    });
    setActiveModule(null);
  }, [activeModule, quizState]);

  const resetProgress = useCallback(() => {
    setProgress({ completedModules: [], moduleScores: {}, badges: [] });
    setActiveModule(null);
  }, []);

  return (
    <section className="py-16 px-4" aria-labelledby="learning-heading">
      <div className="container max-w-5xl mx-auto">
        <h2 id="learning-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
          🎓 Civic Learning Journey
        </h2>
        <p className="text-muted-foreground text-center mb-2 font-sans text-sm">
          Structured learning path with quizzes and achievement badges
        </p>

        {/* Overall Progress */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center justify-between text-xs font-sans text-muted-foreground mb-1">
            <span>Overall Progress</span>
            <span>{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>

        {/* Badges */}
        {progress.badges.length > 0 && (
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {progress.badges.map((badge) => {
              const level = LEARNING_LEVELS.find((l) => l.badge === badge);
              return (
                <motion.div key={badge} initial={{ scale: 0 }} animate={{ scale: 1 }} className="civic-badge-success flex items-center gap-1.5 px-3 py-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{level?.badgeIcon} {badge}</span>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Level Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {LEARNING_LEVELS.map((level) => {
            const done = level.modules.filter((m) => progress.completedModules.includes(m.id)).length;
            return (
              <button
                key={level.id}
                onClick={() => { setActiveLevel(level.id); setActiveModule(null); }}
                className={`px-4 py-2 rounded-xl text-sm font-sans transition focus:outline-none focus:ring-2 focus:ring-ring ${
                  activeLevel === level.id ? "bg-accent text-accent-foreground" : "bg-card border text-muted-foreground hover:bg-muted"
                }`}
                aria-pressed={activeLevel === level.id}
              >
                {level.badgeIcon} {level.name}
                <span className="ml-1.5 text-[10px] opacity-70">{done}/{level.modules.length}</span>
              </button>
            );
          })}
          <button onClick={resetProgress} className="p-2 rounded-xl border text-muted-foreground hover:bg-muted transition" aria-label="Reset progress">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeModule ? (
            <motion.div key={activeModule.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto">
              <button onClick={() => setActiveModule(null)} className="text-xs text-accent font-sans mb-3 hover:underline flex items-center gap-1">
                ← Back to modules
              </button>

              <div className="civic-card p-6 space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-foreground font-sans flex items-center gap-2">
                    <span className="text-2xl">{activeModule.icon}</span> {activeModule.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans">{activeModule.description}</p>
                </div>

                {/* Content */}
                {!quizState.showResult && quizState.current === 0 && quizState.answers.every((a) => a === null) && (
                  <div className="space-y-2">
                    {activeModule.content.map((c, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-2 text-sm font-sans text-foreground">
                        <BookOpen className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        {c}
                      </motion.div>
                    ))}
                    <button
                      onClick={() => setQuizState((p) => ({ ...p, current: 0 }))}
                      className="mt-4 w-full px-4 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold font-sans transition hover:opacity-90"
                    >
                      Start Quiz ({activeModule.quiz.length} questions)
                    </button>
                  </div>
                )}

                {/* Quiz */}
                {!quizState.showResult && (quizState.answers.some((a) => a !== null) || quizState.current > 0 || quizState.answers[0] !== null) && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-sans text-muted-foreground">
                      <span>Question {quizState.current + 1} of {activeModule.quiz.length}</span>
                      <Progress value={((quizState.current + 1) / activeModule.quiz.length) * 100} className="w-24 h-1.5" />
                    </div>

                    <p className="text-sm font-medium text-foreground font-sans">{activeModule.quiz[quizState.current].question}</p>

                    <div className="space-y-2">
                      {activeModule.quiz[quizState.current].options.map((opt, oi) => {
                        const answered = quizState.answers[quizState.current] !== null;
                        const selected = quizState.answers[quizState.current] === oi;
                        const correct = oi === activeModule.quiz[quizState.current].correctIndex;
                        return (
                          <button
                            key={oi}
                            onClick={() => answerQuestion(oi)}
                            disabled={answered}
                            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-sans transition border ${
                              answered && correct ? "bg-civic-success/10 border-civic-success text-civic-success" :
                              answered && selected && !correct ? "bg-destructive/10 border-destructive text-destructive" :
                              "bg-card hover:bg-muted border-border"
                            }`}
                          >
                            {opt}
                            {answered && correct && <Check className="w-3.5 h-3.5 inline ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizState.answers[quizState.current] !== null && (
                      <div className="text-xs text-muted-foreground font-sans bg-muted/50 p-2 rounded-lg">
                        {activeModule.quiz[quizState.current].explanation}
                      </div>
                    )}

                    {quizState.answers[quizState.current] !== null && (
                      <button
                        onClick={nextQuestion}
                        className="w-full px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-sans flex items-center justify-center gap-1.5"
                      >
                        {quizState.current + 1 >= activeModule.quiz.length ? "See Results" : "Next"} <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Results */}
                {quizState.showResult && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
                    <div className="text-4xl">🎉</div>
                    <p className="text-lg font-bold text-foreground font-sans">
                      {quizState.answers.filter((a, i) => a === activeModule!.quiz[i]?.correctIndex).length} / {activeModule!.quiz.length} Correct
                    </p>
                    <p className="text-sm text-muted-foreground font-sans">
                      {Math.round((quizState.answers.filter((a, i) => a === activeModule!.quiz[i]?.correctIndex).length / activeModule!.quiz.length) * 100)}% score
                    </p>
                    <button
                      onClick={completeModule}
                      className="px-6 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold font-sans"
                    >
                      Complete & Continue
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="modules" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Level Progress */}
              <div className="text-center mb-4">
                <span className="text-xs font-sans text-muted-foreground">
                  {currentLevel.name} Level — {levelProgress}% complete
                </span>
                {levelProgress === 100 && (
                  <span className="ml-2 civic-badge-success text-[10px]">
                    <Award className="w-3 h-3 inline mr-1" />{currentLevel.badge} Earned!
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {currentLevel.modules.map((mod, i) => {
                  const completed = progress.completedModules.includes(mod.id);
                  const score = progress.moduleScores[mod.id];
                  return (
                    <motion.button
                      key={mod.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => startModule(mod)}
                      className={`civic-card-hover p-4 text-left w-full ${completed ? "border-civic-success/30" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{mod.icon}</span>
                        {completed && <Check className="w-4 h-4 text-civic-success" />}
                      </div>
                      <h4 className="text-sm font-semibold text-foreground font-sans">{mod.title}</h4>
                      <p className="text-xs text-muted-foreground font-sans mt-1">{mod.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-muted-foreground font-sans">{mod.quiz.length} questions</span>
                        {score !== undefined && (
                          <span className={`text-[10px] font-sans font-medium ${score >= 70 ? "text-civic-success" : "text-civic-amber"}`}>
                            Score: {score}%
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

export default LearningPath;
