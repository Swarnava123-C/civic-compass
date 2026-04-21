import { useState, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Vote, Plus, Trash2, Play, AlertTriangle, Check, RotateCcw } from "lucide-react";
import { INDIA_STATES } from "@/data/indiaElectionData";
import { simulateElection, validateVoteShares, type PartyInput, type SimulationResult } from "@/utils/electionSimulator";

const PARTY_COLORS = [
  "hsl(217, 72%, 41%)",
  "hsl(160, 64%, 43%)",
  "hsl(43, 96%, 56%)",
  "hsl(0, 72%, 51%)",
  "hsl(280, 60%, 50%)",
  "hsl(30, 80%, 55%)",
];

const MockElection = memo(function MockElection() {
  const [selectedStateCode, setSelectedStateCode] = useState("UP");
  const [parties, setParties] = useState<PartyInput[]>([
    { name: "Party A", voteSharePercent: 40 },
    { name: "Party B", voteSharePercent: 35 },
    { name: "Party C", voteSharePercent: 25 },
  ]);
  const [swing, setSwing] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const stateData = useMemo(
    () => INDIA_STATES.find((s) => s.code === selectedStateCode),
    [selectedStateCode]
  );
  const totalSeats = stateData?.totalConstituencies ?? 100;

  const updateParty = useCallback((index: number, field: keyof PartyInput, value: string | number) => {
    setParties((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setResult(null);
  }, []);

  const addParty = useCallback(() => {
    if (parties.length >= 6) return;
    setParties((prev) => [...prev, { name: `Party ${String.fromCharCode(65 + prev.length)}`, voteSharePercent: 0 }]);
    setResult(null);
  }, [parties.length]);

  const removeParty = useCallback((index: number) => {
    setParties((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  }, []);

  const runSimulation = useCallback(() => {
    const validationErrors = validateVoteShares(parties);
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map((e) => e.message));
      setResult(null);
      return;
    }
    setErrors([]);
    setResult(simulateElection(totalSeats, parties, swing));
  }, [parties, totalSeats, swing]);

  const resetSimulation = useCallback(() => {
    setResult(null);
    setErrors([]);
    setSwing(0);
    setParties([
      { name: "Party A", voteSharePercent: 40 },
      { name: "Party B", voteSharePercent: 35 },
      { name: "Party C", voteSharePercent: 25 },
    ]);
  }, []);

  const voteTotal = useMemo(() => parties.reduce((s, p) => s + p.voteSharePercent, 0), [parties]);

  return (
    <section className="py-16 px-4" aria-labelledby="mock-election-heading">
      <div className="container max-w-5xl mx-auto">
        <h2 id="mock-election-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
          🗳 Mock Election Simulator
        </h2>
        <p className="text-muted-foreground text-center mb-8 font-sans text-sm">
          Educational FPTP simulation tool — not a prediction. Results are illustrative only.
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="civic-card p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground font-sans block mb-1.5">Select State / UT</label>
              <select
                value={selectedStateCode}
                onChange={(e) => { setSelectedStateCode(e.target.value); setResult(null); }}
                className="w-full px-3 py-2 rounded-xl border bg-card text-foreground text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Select state for simulation"
              >
                {INDIA_STATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.name} ({s.totalConstituencies} seats)</option>
                ))}
              </select>
            </div>

            <div className="text-xs text-muted-foreground font-sans">
              Total Constituencies: <strong className="text-foreground">{totalSeats}</strong> · Majority Mark: <strong className="text-foreground">{Math.floor(totalSeats / 2) + 1}</strong>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground font-sans">Parties & Vote Share</span>
                <span className={`text-xs font-sans font-medium ${Math.abs(voteTotal - 100) <= 0.5 ? "text-civic-success" : "text-destructive"}`}>
                  Total: {voteTotal.toFixed(1)}%
                </span>
              </div>
              {parties.map((party, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: PARTY_COLORS[i % PARTY_COLORS.length] }} />
                  <input
                    type="text"
                    value={party.name}
                    onChange={(e) => updateParty(i, "name", e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border bg-card text-foreground text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ring min-w-0"
                    maxLength={30}
                    aria-label={`Party ${i + 1} name`}
                  />
                  <input
                    type="number"
                    value={party.voteSharePercent}
                    onChange={(e) => updateParty(i, "voteSharePercent", parseFloat(e.target.value) || 0)}
                    className="w-20 px-2.5 py-1.5 rounded-lg border bg-card text-foreground text-sm font-sans text-right focus:outline-none focus:ring-2 focus:ring-ring"
                    min={0}
                    max={100}
                    step={0.1}
                    aria-label={`${party.name} vote share percent`}
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                  {parties.length > 2 && (
                    <button onClick={() => removeParty(i)} className="p-1 text-muted-foreground hover:text-destructive transition" aria-label={`Remove ${party.name}`}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {parties.length < 6 && (
                <button onClick={addParty} className="flex items-center gap-1.5 text-xs text-accent hover:underline font-sans">
                  <Plus className="w-3 h-3" /> Add Party
                </button>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground font-sans block mb-1.5">
                Swing Adjustment: <span className="text-accent">{swing > 0 ? "+" : ""}{swing}%</span>
              </label>
              <input
                type="range"
                min={-15}
                max={15}
                step={0.5}
                value={swing}
                onChange={(e) => { setSwing(parseFloat(e.target.value)); setResult(null); }}
                className="w-full accent-accent"
                aria-label="Swing adjustment percentage"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-sans">
                <span>-15%</span><span>0</span><span>+15%</span>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-sans space-y-1">
                {errors.map((e, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {e}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={runSimulation}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-semibold font-sans transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Run election simulation"
              >
                <Play className="w-4 h-4" /> Run Simulation
              </button>
              <button
                onClick={resetSimulation}
                className="px-3 py-2.5 rounded-xl border text-muted-foreground text-sm font-sans transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="civic-card p-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  {/* Outcome */}
                  <div className={`p-4 rounded-xl text-center ${result.hasOutrightMajority ? "bg-civic-success/10" : "bg-civic-amber/10"}`}>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {result.hasOutrightMajority ? <Check className="w-5 h-5 text-civic-success" /> : <AlertTriangle className="w-5 h-5 text-civic-amber" />}
                      <span className="font-bold text-foreground font-sans text-lg">
                        {result.hasOutrightMajority ? "Majority Achieved" : "Hung Assembly"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans">
                      {result.hasOutrightMajority
                        ? `${result.majorityParty} wins ${result.partySeats[0].seats} of ${result.totalSeats} seats (need ${result.majorityMark})`
                        : `No party crossed the majority mark of ${result.majorityMark} seats`
                      }
                    </p>
                    {result.coalitionSuggestion && (
                      <p className="text-xs text-accent font-sans mt-1">{result.coalitionSuggestion}</p>
                    )}
                  </div>

                  {/* Seat Chart */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground font-sans mb-3">Seat Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={result.partySeats} layout="vertical" margin={{ left: 5 }}>
                        <XAxis type="number" domain={[0, totalSeats]} tick={{ fontSize: 10 }} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={60} />
                        <Tooltip
                          formatter={(value: number) => [`${value} seats`, "Result"]}
                          contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: "12px" }}
                        />
                        <ReferenceLine x={result.majorityMark} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: "Majority", fill: "hsl(var(--destructive))", fontSize: 10 }} />
                        <Bar dataKey="seats" radius={[0, 6, 6, 0]}>
                          {result.partySeats.map((_, i) => (
                            <Cell key={i} fill={PARTY_COLORS[i % PARTY_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Summary Table */}
                  <div className="text-xs font-sans">
                    <div className="grid grid-cols-3 gap-1 font-medium text-muted-foreground border-b pb-1 mb-1">
                      <span>Party</span><span className="text-right">Seats</span><span className="text-right">Vote %</span>
                    </div>
                    {result.partySeats.map((p, i) => (
                      <div key={i} className="grid grid-cols-3 gap-1 py-0.5">
                        <span className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: PARTY_COLORS[i % PARTY_COLORS.length] }} />
                          {p.name}
                        </span>
                        <span className="text-right font-medium">{p.seats}</span>
                        <span className="text-right text-muted-foreground">{p.voteShare}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                  <Vote className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground font-sans">Configure parties and run the simulation</p>
                  <p className="text-xs text-muted-foreground/60 font-sans mt-1">Results will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-4 font-sans">
          ⚠️ This is an educational simulation using a simplified FPTP model (cube rule approximation). Real elections depend on constituency-level dynamics. Not a prediction.
        </p>
      </div>
    </section>
  );
});

export default MockElection;
