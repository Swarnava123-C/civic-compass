import { memo } from "react";
import { motion } from "framer-motion";
import { Vote, ListChecks, Landmark, Scale } from "lucide-react";

const CARDS = [
  {
    title: "What Are Elections?",
    icon: Vote,
    content:
      "Elections are formal processes by which citizens choose individuals to hold public office. They are the cornerstone of representative democracy, allowing people to express their preferences for governance.",
  },
  {
    title: "Types of Elections",
    icon: ListChecks,
    content:
      "General elections choose national leaders and legislators. Local elections determine regional and municipal officials. Primaries select party candidates. Referendums let citizens vote directly on policy issues.",
  },
  {
    title: "Key Institutions",
    icon: Landmark,
    content:
      "Election commissions oversee the process. Courts resolve disputes. Political parties organize candidates. Civil society and media provide oversight and transparency.",
  },
  {
    title: "Why Elections Matter",
    icon: Scale,
    content:
      "Elections enable peaceful transfer of power, provide government legitimacy, give citizens a voice in governance, and create accountability mechanisms for public officials.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const ElectionOverview = memo(function ElectionOverview() {
  return (
    <section className="py-20 px-4 civic-bg-grid" aria-labelledby="overview-heading">
      <div className="container max-w-4xl mx-auto">
        <h2 id="overview-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
          Election Overview
        </h2>
        <p className="text-muted-foreground text-center mb-12 font-sans max-w-lg mx-auto">
          Understanding the foundations of democratic elections
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className="civic-card-hover p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground font-sans">{card.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">{card.content}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default ElectionOverview;
