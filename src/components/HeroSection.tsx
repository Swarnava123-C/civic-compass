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
            🏛️ Civic Education Platform
          </span>
          <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            CivicFlow
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-4 font-sans">
            Understand elections, voting processes, and civic participation — clearly, neutrally, and interactively.
          </p>
          <div className="civic-badge bg-primary-foreground/20 text-primary-foreground text-xs font-sans mt-4">
            ⚠️ Informational only — not an official government source
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default HeroSection;
