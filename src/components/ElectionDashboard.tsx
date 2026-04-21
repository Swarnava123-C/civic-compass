import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { Vote, Users, TrendingUp, MapPin } from "lucide-react";
import { INDIA_STATES, NATIONAL_AVERAGE_TURNOUT, TOTAL_LOK_SABHA_SEATS, type IndiaStateElectionData } from "@/data/indiaElectionData";
import type { StateInfo } from "@/types/civic";

interface ElectionDashboardProps {
  selectedState: StateInfo | null;
}

const COLORS = [
  "hsl(217, 72%, 41%)",
  "hsl(160, 64%, 43%)",
  "hsl(43, 96%, 56%)",
  "hsl(0, 72%, 51%)",
  "hsl(280, 60%, 50%)",
  "hsl(30, 80%, 55%)",
];

const KPICard = memo(function KPICard({ icon: Icon, label, value, sub }: { icon: typeof Vote; label: string; value: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="civic-card-hover p-5"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <span className="text-xs font-medium text-muted-foreground font-sans uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground font-sans">{value}</p>
      {sub && <p className="text-xs text-muted-foreground font-sans mt-1">{sub}</p>}
    </motion.div>
  );
});

const ElectionDashboard = memo(function ElectionDashboard({ selectedState }: ElectionDashboardProps) {
  const stateData: IndiaStateElectionData | null = useMemo(() => {
    if (!selectedState) return null;
    return INDIA_STATES.find((s) => s.code === selectedState.code) ?? null;
  }, [selectedState]);

  // Top 10 states by turnout for bar chart
  const turnoutBarData = useMemo(() =>
    [...INDIA_STATES]
      .sort((a, b) => b.voterTurnout - a.voterTurnout)
      .slice(0, 10)
      .map((s) => ({ name: s.code, turnout: s.voterTurnout, fullName: s.name })),
  []);

  // Vote share pie for selected state
  const voteShareData = useMemo(() => {
    if (!stateData) return [];
    return stateData.voteShare.map((v) => ({ name: v.party, value: v.percentage }));
  }, [stateData]);

  // Turnout comparison line (state vs national)
  const comparisonData = useMemo(() => {
    const states = selectedState
      ? INDIA_STATES.filter((s) => s.type === "state").sort((a, b) => a.name.localeCompare(b.name))
      : INDIA_STATES.filter((s) => s.type === "state").sort((a, b) => a.name.localeCompare(b.name));
    return states.map((s) => ({
      name: s.code,
      stateTurnout: s.voterTurnout,
      nationalAvg: NATIONAL_AVERAGE_TURNOUT,
    }));
  }, [selectedState]);

  const totalVoters = useMemo(() =>
    INDIA_STATES.reduce((sum, s) => sum + s.totalVotesCast, 0),
  []);

  const avgTurnout = useMemo(() => {
    const states = INDIA_STATES.filter((s) => s.type === "state");
    return (states.reduce((sum, s) => sum + s.voterTurnout, 0) / states.length).toFixed(1);
  }, []);

  return (
    <section className="py-16 px-4 civic-bg-grid" aria-labelledby="dashboard-heading">
      <div className="container max-w-6xl mx-auto">
        <h2 id="dashboard-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
          {stateData ? `${stateData.name} — Election Dashboard` : "India Election Dashboard"}
        </h2>
        <p className="text-muted-foreground text-center mb-10 font-sans">
          {stateData ? "State-specific election data and analysis" : "National election data overview based on most recent elections"}
        </p>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stateData ? (
            <>
              <KPICard icon={Vote} label="Voter Turnout" value={`${stateData.voterTurnout}%`} sub={`Last election: ${stateData.lastElectionYear}`} />
              <KPICard icon={MapPin} label="Constituencies" value={stateData.totalConstituencies.toString()} sub={stateData.type === "state" ? "Assembly seats" : "Lok Sabha seats"} />
              <KPICard icon={Users} label="Votes Cast" value={`${(stateData.totalVotesCast / 1000000).toFixed(1)}M`} sub="Total valid votes" />
              <KPICard icon={TrendingUp} label="Next Election" value={stateData.upcomingElection.split(" ")[0] || "TBD"} sub={stateData.upcomingElection} />
            </>
          ) : (
            <>
              <KPICard icon={Vote} label="Avg Turnout" value={`${avgTurnout}%`} sub={`National: ${NATIONAL_AVERAGE_TURNOUT}% (Lok Sabha 2024)`} />
              <KPICard icon={MapPin} label="Lok Sabha Seats" value={TOTAL_LOK_SABHA_SEATS.toString()} sub="Total parliamentary constituencies" />
              <KPICard icon={Users} label="Total Votes" value={`${(totalVoters / 1000000000).toFixed(2)}B`} sub="Across all states (latest elections)" />
              <KPICard icon={TrendingUp} label="States & UTs" value={INDIA_STATES.length.toString()} sub="28 States + 8 Union Territories" />
            </>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Turnout Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="civic-card p-5"
          >
            <h3 className="text-sm font-semibold text-foreground font-sans mb-4">
              Top 10 States by Voter Turnout (%)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={turnoutBarData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={30} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Turnout"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                />
                <Bar dataKey="turnout" fill="hsl(217, 72%, 41%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Vote Share Pie (if state selected) or Constituency Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="civic-card p-5"
          >
            <h3 className="text-sm font-semibold text-foreground font-sans mb-4">
              {stateData ? `${stateData.name} — Vote Share Distribution` : "State Turnout vs National Average"}
            </h3>
            {stateData ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={voteShareData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }: { name: string; value: number }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {voteShareData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, "Vote Share"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={comparisonData} margin={{ top: 5, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={1} />
                  <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                  <Line type="monotone" dataKey="stateTurnout" stroke="hsl(217, 72%, 41%)" strokeWidth={2} dot={{ r: 3 }} name="State Turnout" />
                  <Line type="monotone" dataKey="nationalAvg" stroke="hsl(43, 96%, 56%)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="National Avg" />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8 font-sans">
          Data based on most recent elections. For official data, visit{" "}
          <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">eci.gov.in</a>
        </p>
      </div>
    </section>
  );
});

export default ElectionDashboard;
