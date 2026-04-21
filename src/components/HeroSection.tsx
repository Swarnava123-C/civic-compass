import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";

const HeroSection = memo(function HeroSection() {
  return (
    <section className="relative overflow-hidden civic-gradient py-24 px-4 text-primary-foreground" aria-labelledby="hero-heading">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />
      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/20 rounded-full blur-[120px]" />

      <div className="container max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="civic-badge bg-primary-foreground/15 text-primary-foreground mb-5 inline-flex items-center gap-2 backdrop-blur-sm font-sans"
          >
            <Shield className="w-3.5 h-3.5" />
            Interactive Civic Education Platform
          </motion.span>

          <h1 id="hero-heading" className="text-5xl md:text-6xl lg:text-7xl font-bold mb-5 leading-tight tracking-tight">
            CivicFlow Pro
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-3 font-sans leading-relaxed"
          >
            Understand elections, government structures, and civic participation through interactive simulations, guided intelligence, and structured learning.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-sm max-w-xl mx-auto mb-8 font-sans"
          >
            Timelines · Voting Guides · Scenario Simulator · Government Explainer · AI Assistant · Civic Quiz
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <a
              href="#overview-heading"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-foreground text-foreground text-sm font-semibold font-sans transition-all hover:shadow-lg hover:shadow-primary-foreground/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-foreground"
            >
              <Sparkles className="w-4 h-4" />
              Start Learning
            </a>
            <div className="civic-badge bg-primary-foreground/10 text-primary-foreground text-xs font-sans backdrop-blur-sm">
              ⚠️ Informational only — not an official government source
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

export default HeroSection;
