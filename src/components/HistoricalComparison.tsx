import { memo, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { HISTORICAL_DATA, getHistoricalDataForState, type StateHistoricalData } from "@/data/historicalData";
import type { StateInfo } from "@/types/civic";

interface Props {
  selectedState: StateInfo | null;
}

const TrendArrow = memo(function TrendArrow({ value }: { value: number }) {
  if (value > 0.5) return <TrendingUp className="w-3.5 h-3.5 text-civic-success inline" />;
  if (value < -0.5) return <TrendingDown className="w-3.5 h-3.5 text-destructive inline" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground inline" />;
});

const HistoricalComparison = memo(function HistoricalComparison({ selectedState }: Props) {
  const [viewState, setViewState] = useState<string>(selectedState?.code ?? HISTORICAL_DATA[0]?.stateCode ?? "UP");

  useEffect(() => {
    if (selectedState) {
      setViewState(selectedState.code);
    }
  }, [selectedState]);

  const activeData: StateHistoricalData | null = useMemo(() => {
    return getHistoricalDataForState(viewState);
  }, [viewState]);

  if (!activeData) {
    return (
      <section className="py-16 px-4" aria-labelledby="historical-heading">
        <div className="container max-w-5xl mx-auto text-center">
          <h2 id="historical-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-2">📊 Election Trends</h2>
          <p className="text-muted-foreground font-sans text-sm">
            {selectedState ? `Historical data not available for ${selectedState.name} yet.` : "Select a state to view trends."}
          </p>
        </div>
      </section>
    );
  }

  const elections = activeData.elections;
  const latest = elections[elections.length - 1];
  const previous = elections.length >= 2 ? elections[elections.length - 2] : null;

  const turnoutChange = previous ? latest.turnoutPercent - previous.turnoutPercent : 0;
  const seatChange = previous ? latest.topPartySeats - previous.topPartySeats : 0;

  const turnoutTrend = elections.map((e) => ({
    year: e.year.toString(),
    turnout: e.turnoutPercent,
  }));

  // Build seat comparison — handle party names changing across elections
  const seatComparison = elections.map((e) => ({
    year: e.year.toString(),
    [e.topParty]: e.topPartySeats,
    [e.majorOpposition]: e.majorOppositionSeats,
    Others: e.totalSeats - e.topPartySeats - e.majorOppositionSeats,
  }));

  // Collect all unique party names for bar chart
  const allParties = new Set<string>();
  elections.forEach((e) => { allParties.add(e.topParty); allParties.add(e.majorOpposition); });
  allParties.delete("Others");
  const partyList = Array.from(allParties);
  const PARTY_COLORS = ["hsl(217, 72%, 41%)", "hsl(160, 64%, 43%)", "hsl(40, 90%, 55%)", "hsl(280, 60%, 55%)"];

  return (
    <section className="py-16 px-4" aria-labelledby="historical-heading">
      <div className="container max-w-5xl mx-auto">
        <h2 id="historical-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
          📊 Election Trends — {activeData.stateName}
        </h2>
        <p className="text-muted-foreground text-center mb-6 font-sans text-sm">
          Historical comparison of election outcomes — factual data only
        </p>

        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {HISTORICAL_DATA.map((d) => (
            <button
              key={d.stateCode}
              onClick={() => setViewState(d.stateCode)}
              className={`px-3 py-1.5 rounded-full text-xs font-sans transition focus:outline-none focus:ring-2 focus:ring-ring ${
                viewState === d.stateCode ? "bg-accent text-accent-foreground" : "bg-card border text-muted-foreground hover:bg-muted"
              }`}
              aria-pressed={viewState === d.stateCode}
            >
              {d.stateName}
            </button>
          ))}
        </div>

        {/* Trend Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="civic-card p-4 text-center">
            <p className="text-xs text-muted-foreground font-sans mb-1">Latest Turnout</p>
            <p className="text-xl font-bold text-foreground font-sans">{latest.turnoutPercent}%</p>
            {previous && (
              <p className="text-xs font-sans mt-1 flex items-center justify-center gap-1">
                <TrendArrow value={turnoutChange} />
                <span className={turnoutChange > 0 ? "text-civic-success" : turnoutChange < 0 ? "text-destructive" : "text-muted-foreground"}>
                  {turnoutChange > 0 ? "+" : ""}{turnoutChange.toFixed(1)}%
                </span>
              </p>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="civic-card p-4 text-center">
            <p className="text-xs text-muted-foreground font-sans mb-1">Winner ({latest.year})</p>
            <p className="text-lg font-bold text-foreground font-sans">{latest.topParty}</p>
            <p className="text-xs text-muted-foreground font-sans">{latest.topPartySeats} seats</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="civic-card p-4 text-center">
            <p className="text-xs text-muted-foreground font-sans mb-1">Seat Change</p>
            <p className="text-xl font-bold text-foreground font-sans flex items-center justify-center gap-1">
              <TrendArrow value={seatChange} />
              {seatChange > 0 ? "+" : ""}{seatChange}
            </p>
            <p className="text-xs text-muted-foreground font-sans">vs previous election</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="civic-card p-4 text-center">
            <p className="text-xs text-muted-foreground font-sans mb-1">Total Seats</p>
            <p className="text-xl font-bold text-foreground font-sans">{latest.totalSeats}</p>
            <p className="text-xs text-muted-foreground font-sans">Majority: {Math.floor(latest.totalSeats / 2) + 1}</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Turnout Trend */}
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="civic-card p-5">
            <h3 className="text-sm font-semibold text-foreground font-sans mb-4">Turnout Trend (%) — {activeData.stateName}</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={turnoutTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: "12px" }} />
                <Line type="monotone" dataKey="turnout" stroke="hsl(217, 72%, 41%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(217, 72%, 41%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Seat Distribution */}
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="civic-card p-5">
            <h3 className="text-sm font-semibold text-foreground font-sans mb-4">Seat Distribution — {activeData.stateName}</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={seatComparison}>
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                {partyList.map((party, idx) => (
                  <Bar key={party} dataKey={party} fill={PARTY_COLORS[idx % PARTY_COLORS.length]} radius={[4, 4, 0, 0]} />
                ))}
                <Bar dataKey="Others" fill="hsl(220, 15%, 75%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Trend Explanation */}
        {previous && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="civic-card p-4 mt-6">
            <h3 className="text-sm font-semibold text-foreground font-sans mb-2 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-accent" /> Trend Explanation — {activeData.stateName}
            </h3>
            <ul className="text-xs text-muted-foreground font-sans space-y-1">
              <li>• Turnout {turnoutChange >= 0 ? "increased" : "decreased"} by {Math.abs(turnoutChange).toFixed(1)}% compared to the {previous.year} election.</li>
              <li>• {latest.topParty} won {latest.topPartySeats} seats in {latest.year} vs {previous.topParty}'s {previous.topPartySeats} in {previous.year}.</li>
              <li>• {latest.topPartySeats >= Math.floor(latest.totalSeats / 2) + 1 ? "An outright majority was achieved." : "No single party achieved an outright majority."}</li>
            </ul>
          </motion.div>
        )}

        <p className="text-[10px] text-muted-foreground text-center mt-4 font-sans">
          Data modeled on ECI records. For official data, visit <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">eci.gov.in</a>
        </p>
      </div>
    </section>
  );
});

export default HistoricalComparison;
