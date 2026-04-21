import { memo } from "react";
import { motion } from "framer-motion";

const HeroSection = memo(function HeroSection() {
  return (
    <section className="civic-gradient py-20 px-4 text-primary-foreground" aria-labelledby="hero-heading">
      <div className="container max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="civic-badge-gold mb-4 inline-block font-sans" role="status">
            🏛️ Interactive Civic Education Platform
          </span>
          <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            CivicFlow Pro
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-2 font-sans">
            Understand elections, government structures, and civic participation through interactive simulations, guided intelligence, and structured learning.
          </p>
          <p className="text-sm opacity-75 max-w-xl mx-auto mb-6 font-sans">
            Timelines · Voting Guides · Scenario Simulator · Government Explainer · AI Assistant · Civic Quiz
          </p>
          <div className="civic-badge bg-primary-foreground/20 text-primary-foreground text-xs font-sans">
            ⚠️ Informational only — not an official government source
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default HeroSection;
