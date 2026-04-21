import { memo, useCallback, useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { INDIA_STATES, NATIONAL_AVERAGE_TURNOUT, type IndiaStateElectionData } from "@/data/indiaElectionData";
import type { StateInfo } from "@/types/civic";

interface IndiaMapProps {
  selectedState: StateInfo | null;
  onSelectState: (state: StateInfo | null) => void;
}

const STATE_POSITIONS: Record<string, { row: number; col: number }> = {
  JK: { row: 0, col: 2 }, LA: { row: 0, col: 3 },
  HP: { row: 1, col: 2 }, UK: { row: 1, col: 3 }, PB: { row: 1, col: 1 }, CH: { row: 1, col: 1 },
  HR: { row: 2, col: 1 }, DL: { row: 2, col: 2 }, UP: { row: 2, col: 3 }, BR: { row: 2, col: 4 }, SK: { row: 1, col: 5 },
  RJ: { row: 3, col: 0 }, MP: { row: 3, col: 2 }, JH: { row: 3, col: 4 }, AR: { row: 1, col: 6 },
  GJ: { row: 4, col: 0 }, MH: { row: 4, col: 1 }, CG: { row: 4, col: 3 }, WB: { row: 3, col: 5 },
  DN: { row: 5, col: 0 }, TS: { row: 5, col: 2 }, OD: { row: 4, col: 4 }, AS: { row: 2, col: 6 },
  GA: { row: 6, col: 0 }, KA: { row: 6, col: 1 }, AP: { row: 5, col: 3 }, NL: { row: 2, col: 7 },
  KL: { row: 7, col: 1 }, TN: { row: 7, col: 2 }, PY: { row: 7, col: 3 }, MN: { row: 3, col: 7 },
  LD: { row: 8, col: 0 }, AN: { row: 8, col: 4 }, ML: { row: 3, col: 6 }, MZ: { row: 4, col: 7 },
  TR: { row: 4, col: 6 },
};

function getTurnoutColor(turnout: number): string {
  if (turnout >= 80) return "bg-[hsl(217,72%,30%)]";
  if (turnout >= 70) return "bg-[hsl(217,72%,41%)]";
  if (turnout >= 60) return "bg-[hsl(217,60%,55%)]";
  return "bg-[hsl(217,50%,70%)]";
}

function getTurnoutLabel(turnout: number): string {
  if (turnout >= 80) return "Very High";
  if (turnout >= 70) return "High";
  if (turnout >= 60) return "Moderate";
  return "Low";
}

const IndiaMap = memo(function IndiaMap({ selectedState, onSelectState }: IndiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const stateDataMap = useMemo(() => {
    const map = new Map<string, IndiaStateElectionData>();
    for (const s of INDIA_STATES) map.set(s.code, s);
    return map;
  }, []);

  const handleClick = useCallback((code: string) => {
    const data = stateDataMap.get(code);
    if (data) {
      if (selectedState?.code === code) {
        onSelectState(null);
      } else {
        onSelectState({ name: data.name, code: data.code });
      }
    }
  }, [selectedState, onSelectState, stateDataMap]);

  const hoveredData = hoveredState ? stateDataMap.get(hoveredState) : null;

  const maxRow = Math.max(...Object.values(STATE_POSITIONS).map(p => p.row));
  const maxCol = Math.max(...Object.values(STATE_POSITIONS).map(p => p.col));

  // Build flat list of states in grid order for keyboard nav
  const flatStates = useMemo(() => {
    const list: (IndiaStateElectionData | null)[] = [];
    for (let r = 0; r <= maxRow; r++) {
      for (let c = 0; c <= maxCol; c++) {
        const entry = Object.entries(STATE_POSITIONS).find(([, pos]) => pos.row === r && pos.col === c);
        if (entry) {
          list.push(stateDataMap.get(entry[0]) ?? null);
        } else {
          list.push(null);
        }
      }
    }
    return list;
  }, [stateDataMap, maxRow, maxCol]);

  const stateIndices = useMemo(() => {
    const indices: number[] = [];
    flatStates.forEach((s, i) => { if (s) indices.push(i); });
    return indices;
  }, [flatStates]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, currentIndex: number) => {
    const cols = maxCol + 1;
    let targetIndex = -1;

    if (e.key === "ArrowRight") {
      const pos = stateIndices.indexOf(currentIndex);
      if (pos < stateIndices.length - 1) targetIndex = stateIndices[pos + 1];
    } else if (e.key === "ArrowLeft") {
      const pos = stateIndices.indexOf(currentIndex);
      if (pos > 0) targetIndex = stateIndices[pos - 1];
    } else if (e.key === "ArrowDown") {
      const row = Math.floor(currentIndex / cols);
      const col = currentIndex % cols;
      for (let r = row + 1; r <= maxRow; r++) {
        const idx = r * cols + col;
        if (stateIndices.includes(idx)) { targetIndex = idx; break; }
      }
      // fallback: next state
      if (targetIndex === -1) {
        const pos = stateIndices.indexOf(currentIndex);
        if (pos < stateIndices.length - 1) targetIndex = stateIndices[pos + 1];
      }
    } else if (e.key === "ArrowUp") {
      const row = Math.floor(currentIndex / cols);
      const col = currentIndex % cols;
      for (let r = row - 1; r >= 0; r--) {
        const idx = r * cols + col;
        if (stateIndices.includes(idx)) { targetIndex = idx; break; }
      }
      if (targetIndex === -1) {
        const pos = stateIndices.indexOf(currentIndex);
        if (pos > 0) targetIndex = stateIndices[pos - 1];
      }
    } else {
      return;
    }

    e.preventDefault();
    if (targetIndex >= 0 && gridRef.current) {
      const buttons = gridRef.current.querySelectorAll<HTMLButtonElement>('[role="gridcell"] button');
      const statePos = stateIndices.indexOf(targetIndex);
      if (statePos >= 0 && buttons[statePos]) {
        buttons[statePos].focus();
      }
    }
  }, [stateIndices, maxRow, maxCol]);

  return (
    <section className="py-16 px-4" aria-labelledby="map-heading">
      <div className="container max-w-5xl mx-auto">
        <h2 id="map-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
          India Electoral Map
        </h2>
        <p className="text-muted-foreground text-center mb-4 font-sans max-w-lg mx-auto">
          Navigate with arrow keys or click any state to view election data. Color shows voter turnout.
        </p>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mb-8 flex-wrap" aria-label="Turnout legend">
          <span className="text-xs text-muted-foreground font-sans">Turnout:</span>
          {[
            { label: "< 60%", cls: "bg-[hsl(217,50%,70%)]" },
            { label: "60-70%", cls: "bg-[hsl(217,60%,55%)]" },
            { label: "70-80%", cls: "bg-[hsl(217,72%,41%)]" },
            { label: "80%+", cls: "bg-[hsl(217,72%,30%)]" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-4 h-4 rounded ${l.cls}`} aria-hidden="true" />
              <span className="text-xs text-muted-foreground font-sans">{l.label}</span>
            </div>
          ))}
          <span className="text-xs text-muted-foreground font-sans ml-4">
            National Avg: {NATIONAL_AVERAGE_TURNOUT}%
          </span>
        </div>

        {/* Tooltip */}
        {hoveredData && (
          <div className="text-center mb-2" role="status" aria-live="polite">
            <span className="text-sm font-semibold text-foreground font-sans">{hoveredData.name}</span>
            <span className="text-xs text-muted-foreground font-sans ml-2">
              Turnout: {hoveredData.voterTurnout}% ({getTurnoutLabel(hoveredData.voterTurnout)}) · {hoveredData.totalConstituencies} constituencies · Last: {hoveredData.lastElectionYear}
            </span>
          </div>
        )}

        {/* Tile Grid Map */}
        <div
          ref={gridRef}
          role="grid"
          aria-label="India electoral map grid"
          className="grid gap-1.5 mx-auto"
          style={{ gridTemplateColumns: `repeat(${maxCol + 1}, minmax(0, 1fr))`, maxWidth: "600px" }}
        >
          {flatStates.map((state, i) => {
            if (!state) return <div key={`empty-${i}`} role="gridcell" className="aspect-square" />;
            const isSelected = selectedState?.code === state.code;
            return (
              <div key={state.code} role="gridcell">
                <motion.button
                  onClick={() => handleClick(state.code)}
                  onMouseEnter={() => setHoveredState(state.code)}
                  onMouseLeave={() => setHoveredState(null)}
                  onFocus={() => setHoveredState(state.code)}
                  onBlur={() => setHoveredState(null)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  tabIndex={i === stateIndices[0] ? 0 : -1}
                  className={`w-full aspect-square rounded-lg ${getTurnoutColor(state.voterTurnout)} text-white text-[10px] font-bold font-sans flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    isSelected ? "ring-2 ring-accent scale-110 shadow-lg z-10" : "hover:scale-105 hover:shadow-md"
                  }`}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`${state.name} — ${state.voterTurnout}% turnout, ${state.totalConstituencies} constituencies`}
                  aria-pressed={isSelected}
                >
                  {state.code}
                </motion.button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6 font-sans">
          Simplified tile grid. Use arrow keys to navigate. Data based on most recent elections.
        </p>
      </div>
    </section>
  );
});

export default IndiaMap;
