import { useState, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Plus, Trash2, Play, RotateCcw } from "lucide-react";

import { INDIA_STATES } from "@/data/indiaElectionData";
import {
  simulateElection,
  validateVoteShares,
  type PartyInput,
  type SimulationResult,
} from "@/utils/electionSimulator";
import { trackSimulatorRun } from "@/utils/analytics";

const PARTY_COLORS: readonly string[] = [
  "hsl(217, 72%, 41%)",
  "hsl(160, 64%, 43%)",
  "hsl(43, 96%, 56%)",
  "hsl(0, 72%, 51%)",
  "hsl(280, 60%, 50%)",
  "hsl(30, 80%, 55%)",
] as const;

const DEFAULT_PARTIES: PartyInput[] = [
  { name: "Party A", voteSharePercent: 40 },
  { name: "Party B", voteSharePercent: 35 },
  { name: "Party C", voteSharePercent: 25 },
];

const MockElection = memo(function MockElection(): JSX.Element {
  const [selectedStateCode, setSelectedStateCode] = useState<string>("UP");
  const [parties, setParties] = useState<PartyInput[]>(DEFAULT_PARTIES);
  const [swing, setSwing] = useState<number>(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // ------------------------------------------------------------------
  // Derived State
  // ------------------------------------------------------------------

  const stateData = useMemo(() => {
    return INDIA_STATES.find((s) => s.code === selectedStateCode);
  }, [selectedStateCode]);

  const totalSeats: number = stateData?.totalConstituencies ?? 100;

  const voteTotal = useMemo<number>(() => {
    return parties.reduce((sum, p) => sum + p.voteSharePercent, 0);
  }, [parties]);

  const majorityMark = useMemo<number>(() => {
    return Math.floor(totalSeats / 2) + 1;
  }, [totalSeats]);

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------

  const updateParty = useCallback(
    (index: number, field: keyof PartyInput, value: string | number) => {
      setParties((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
        return updated;
      });
      setResult(null);
    },
    []
  );

  const addParty = useCallback(() => {
    if (parties.length >= 6) return;

    setParties((prev) => [
      ...prev,
      {
        name: `Party ${String.fromCharCode(65 + prev.length)}`,
        voteSharePercent: 0,
      },
    ]);
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
    const simulation = simulateElection(totalSeats, parties, swing);
    setResult(simulation);

    trackSimulatorRun(selectedStateCode, totalSeats);
  }, [parties, totalSeats, swing, selectedStateCode]);

  const resetSimulation = useCallback(() => {
    setParties(DEFAULT_PARTIES);
    setSwing(0);
    setResult(null);
    setErrors([]);
  }, []);

  // ------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------

  return (
    <section className="py-16 px-4" aria-labelledby="mock-election-heading">
      <div className="container max-w-5xl mx-auto">
        <h2
          id="mock-election-heading"
          className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center"
        >
          🗳 Mock Election Simulator
        </h2>

        <p className="text-muted-foreground text-center mb-8 text-sm">
          Educational FPTP simulation tool — not a prediction.
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* INPUT PANEL */}
          <div className="p-6 rounded-xl border bg-card space-y-5">
            {/* State Select */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Select State / UT
              </label>
              <select
                value={selectedStateCode}
                onChange={(e) => {
                  setSelectedStateCode(e.target.value);
                  setResult(null);
                }}
                className="w-full px-3 py-2 rounded-lg border bg-background"
              >
                {INDIA_STATES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.totalConstituencies} seats)
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-muted-foreground">
              Total Seats: <strong>{totalSeats}</strong> · Majority:{" "}
              <strong>{majorityMark}</strong>
            </div>

            {/* Parties */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>Parties & Vote Share</span>
                <span
                  className={
                    Math.abs(voteTotal - 100) <= 0.5
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  Total: {voteTotal.toFixed(1)}%
                </span>
              </div>

              {parties.map((party, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background:
                        PARTY_COLORS[i % PARTY_COLORS.length],
                    }}
                  />

                  <input
                    type="text"
                    value={party.name}
                    onChange={(e) =>
                      updateParty(i, "name", e.target.value)
                    }
                    className="flex-1 px-2 py-1 rounded border"
                  />

                  <input
                    type="number"
                    value={party.voteSharePercent}
                    onChange={(e) =>
                      updateParty(
                        i,
                        "voteSharePercent",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-20 px-2 py-1 rounded border text-right"
                    min={0}
                    max={100}
                    step={0.1}
                  />

                  {parties.length > 2 && (
                    <button
                      onClick={() => removeParty(i)}
                      className="text-red-500"
                      aria-label="Remove party"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}

              {parties.length < 6 && (
                <button
                  onClick={addParty}
                  className="flex items-center gap-1 text-xs text-blue-600"
                >
                  <Plus size={14} /> Add Party
                </button>
              )}
            </div>

            {/* Swing */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Swing Adjustment: {swing > 0 ? "+" : ""}
                {swing}%
              </label>
              <input
                type="range"
                min={-15}
                max={15}
                step={0.5}
                value={swing}
                onChange={(e) =>
                  setSwing(parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="text-red-600 text-xs space-y-1">
                {errors.map((err, i) => (
                  <div key={i}>{err}</div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={runSimulation}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
              >
                <Play size={16} /> Run
              </button>

              <button
                onClick={resetSimulation}
                className="px-3 py-2 border rounded"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="p-6 rounded-xl border bg-card">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={result.partySeats}
                      layout="vertical"
                    >
                      <XAxis type="number" domain={[0, totalSeats]} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={80}
                      />
                      <Tooltip />
                      <ReferenceLine
                        x={result.majorityMark}
                        stroke="red"
                        strokeDasharray="4 4"
                      />
                      <Bar dataKey="seats">
                        {result.partySeats.map((_, i) => (
                          <Cell
                            key={i}
                            fill={
                              PARTY_COLORS[
                              i % PARTY_COLORS.length
                              ]
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  Configure parties and run simulation.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
});

export default MockElection;
