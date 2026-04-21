import { memo, useCallback } from "react";
import { US_STATES } from "@/data/civicContent";
import type { StateInfo } from "@/types/civic";

interface StateSelectorProps {
  selectedState: StateInfo | null;
  onSelect: (state: StateInfo | null) => void;
}

const StateSelector = memo(function StateSelector({ selectedState, onSelect }: StateSelectorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const code = e.target.value;
      if (!code) {
        onSelect(null);
        return;
      }
      const state = US_STATES.find((s) => s.code === code) ?? null;
      onSelect(state);
    },
    [onSelect]
  );

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="stateSelect" className="text-sm font-medium text-foreground font-sans">
        State / Region:
      </label>
      <select
        id="stateSelect"
        value={selectedState?.code ?? ""}
        onChange={handleChange}
        className="px-3 py-2 rounded-lg border bg-card text-foreground text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Select your state or region"
      >
        <option value="">All States</option>
        {US_STATES.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
});

export default StateSelector;
