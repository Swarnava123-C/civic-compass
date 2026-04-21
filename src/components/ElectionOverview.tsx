import { memo } from "react";
import { motion } from "framer-motion";
import { Vote, ListChecks, Landmark, Scale } from "lucide-react";

const CARDS = [
  {
    title: "Elections in India",
    icon: Vote,
    content:
      "India is the world's largest democracy with over 960 million registered voters. Elections are conducted by the independent Election Commission of India (ECI) using Electronic Voting Machines (EVMs) with Voter Verifiable Paper Audit Trail (VVPAT).",
  },
  {
    title: "Types of Elections",
    icon: ListChecks,
    content:
      "Lok Sabha (Parliamentary) elections are held every 5 years for 543 seats. State Assembly (Vidhan Sabha) elections choose state governments. Local body elections cover Panchayats, Municipalities, and Municipal Corporations. By-elections fill casual vacancies.",
  },
  {
    title: "Key Institutions",
    icon: Landmark,
    content:
      "The Election Commission of India (ECI) — a constitutional body under Article 324 — supervises elections. State Chief Electoral Officers (CEOs) coordinate at state level. District Election Officers manage constituency-level operations.",
  },
  {
    title: "Why Your Vote Matters",
    icon: Scale,
    content:
      "India follows a 'first past the post' system where every vote directly impacts results. Your vote enables peaceful transfer of power, provides government legitimacy, and ensures representation for your community in the world's largest democracy.",
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
          Indian Elections Overview
        </h2>
        <p className="text-muted-foreground text-center mb-12 font-sans max-w-lg mx-auto">
          Understanding the foundations of India's democratic electoral system
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
