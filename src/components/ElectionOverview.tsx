import { memo } from "react";

const CARDS = [
  {
    title: "What Are Elections?",
    icon: "🗳️",
    content:
      "Elections are formal processes by which citizens choose individuals to hold public office. They are the cornerstone of representative democracy, allowing people to express their preferences for governance.",
  },
  {
    title: "Types of Elections",
    icon: "📋",
    content:
      "General elections choose national leaders and legislators. Local elections determine regional and municipal officials. Primaries select party candidates. Referendums let citizens vote directly on policy issues.",
  },
  {
    title: "Key Institutions",
    icon: "🏛️",
    content:
      "Election commissions oversee the process. Courts resolve disputes. Political parties organize candidates. Civil society and media provide oversight and transparency.",
  },
  {
    title: "Why Elections Matter",
    icon: "⚖️",
    content:
      "Elections enable peaceful transfer of power, provide government legitimacy, give citizens a voice in governance, and create accountability mechanisms for public officials.",
  },
];

const ElectionOverview = memo(function ElectionOverview() {
  return (
    <section className="py-16 px-4" aria-labelledby="overview-heading">
      <div className="container max-w-4xl mx-auto">
        <h2 id="overview-heading" className="text-3xl font-bold text-foreground mb-2 text-center">
          Election Overview
        </h2>
        <p className="text-muted-foreground text-center mb-10 font-sans">
          Understanding the foundations of democratic elections
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {CARDS.map((card) => (
            <article key={card.title} className="civic-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl" aria-hidden="true">{card.icon}</span>
                <h3 className="text-lg font-semibold text-foreground font-sans">{card.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">{card.content}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

export default ElectionOverview;
