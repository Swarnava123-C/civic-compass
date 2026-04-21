import { memo, useCallback, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { INDIA_STATES, NATIONAL_AVERAGE_TURNOUT, type IndiaStateElectionData } from "@/data/indiaElectionData";
import type { StateInfo } from "@/types/civic";

interface IndiaMapProps {
  selectedState: StateInfo | null;
  onSelectState: (state: StateInfo | null) => void;
}

// Simplified India map — state positions for interactive grid
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

  // Build grid
  const maxRow = Math.max(...Object.values(STATE_POSITIONS).map(p => p.row));
  const maxCol = Math.max(...Object.values(STATE_POSITIONS).map(p => p.col));

  const grid: (IndiaStateElectionData | null)[][] = Array.from({ length: maxRow + 1 }, () =>
    Array.from({ length: maxCol + 1 }, () => null)
  );

  for (const [code, pos] of Object.entries(STATE_POSITIONS)) {
    const data = stateDataMap.get(code);
    if (data && pos.row <= maxRow && pos.col <= maxCol) {
      grid[pos.row][pos.col] = data;
    }
  }

  return (
    <section className="py-16 px-4" aria-labelledby="map-heading">
      <div className="container max-w-5xl mx-auto">
        <h2 id="map-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
          India Electoral Map
        </h2>
        <p className="text-muted-foreground text-center mb-4 font-sans max-w-lg mx-auto">
          Click any state or UT to view detailed election data. Color intensity indicates voter turnout.
        </p>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
          <span className="text-xs text-muted-foreground font-sans">Turnout:</span>
          {[
            { label: "< 60%", cls: "bg-[hsl(217,50%,70%)]" },
            { label: "60-70%", cls: "bg-[hsl(217,60%,55%)]" },
            { label: "70-80%", cls: "bg-[hsl(217,72%,41%)]" },
            { label: "80%+", cls: "bg-[hsl(217,72%,30%)]" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-4 h-4 rounded ${l.cls}`} />
              <span className="text-xs text-muted-foreground font-sans">{l.label}</span>
            </div>
          ))}
          <span className="text-xs text-muted-foreground font-sans ml-4">
            National Avg: {NATIONAL_AVERAGE_TURNOUT}%
          </span>
        </div>

        {/* Tile Grid Map */}
        <div className="relative">
          {/* Tooltip */}
          {hoveredData && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-20 civic-card p-3 shadow-lg min-w-[200px]" role="tooltip">
              <p className="text-sm font-semibold text-foreground font-sans">{hoveredData.name}</p>
              <p className="text-xs text-muted-foreground font-sans">Turnout: {hoveredData.voterTurnout}% ({getTurnoutLabel(hoveredData.voterTurnout)})</p>
              <p className="text-xs text-muted-foreground font-sans">Constituencies: {hoveredData.totalConstituencies}</p>
              <p className="text-xs text-muted-foreground font-sans">Last Election: {hoveredData.lastElectionYear}</p>
            </div>
          )}

          <div className="grid gap-1.5 mx-auto" style={{ gridTemplateColumns: `repeat(${maxCol + 1}, minmax(0, 1fr))`, maxWidth: "600px" }}>
            {grid.flat().map((state, i) => {
              if (!state) return <div key={`empty-${i}`} className="aspect-square" />;
              const isSelected = selectedState?.code === state.code;
              return (
                <motion.button
                  key={state.code}
                  onClick={() => handleClick(state.code)}
                  onMouseEnter={() => setHoveredState(state.code)}
                  onMouseLeave={() => setHoveredState(null)}
                  className={`aspect-square rounded-lg ${getTurnoutColor(state.voterTurnout)} text-white text-[10px] font-bold font-sans flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring ${
                    isSelected ? "ring-2 ring-accent scale-110 shadow-lg z-10" : "hover:scale-105 hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`${state.name} — ${state.voterTurnout}% turnout`}
                  aria-pressed={isSelected}
                >
                  {state.code}
                </motion.button>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6 font-sans">
          Simplified tile grid representation. Data based on most recent elections.
        </p>
      </div>
    </section>
  );
});

export default IndiaMap;
