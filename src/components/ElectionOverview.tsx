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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ElectionOverview = memo(function ElectionOverview() {
  return (
    <section className="py-16 px-4" aria-labelledby="overview-heading" id="overview-heading">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="civic-badge-info mb-3 inline-block">📚 Foundation</span>
          <h2 id="overview-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Understanding Indian Democracy
          </h2>
          <p className="text-muted-foreground font-sans max-w-2xl mx-auto">
            Essential knowledge about how elections work in the world's largest democracy
          </p>
        </div>
        <motion.div
          className="grid md:grid-cols-2 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                variants={cardVariants}
                className="civic-card-hover p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground font-sans mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground font-sans leading-relaxed">{card.content}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
});

export default ElectionOverview;
