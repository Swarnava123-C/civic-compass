import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Sparkles, ArrowRight } from "lucide-react";

const HeroSection = memo(function HeroSection() {
  return (
    <section className="relative overflow-hidden civic-gradient py-28 md:py-36 px-4 text-primary-foreground" aria-labelledby="hero-heading">
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "32px 32px",
      }} />
      {/* Multi-layer glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/15 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-civic-gold/10 rounded-full blur-[120px]" />

      {/* India flag watermark */}
      <div className="absolute right-8 bottom-8 opacity-[0.04] text-[220px] leading-none select-none pointer-events-none" aria-hidden="true">
        🇮🇳
      </div>

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
            className="civic-badge bg-primary-foreground/15 text-primary-foreground mb-6 inline-flex items-center gap-2 backdrop-blur-sm font-sans"
          >
            <Shield className="w-3.5 h-3.5" />
            India Civic Intelligence Platform
          </motion.span>

          <h1 id="hero-heading" className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[0.95] tracking-tight">
            CivicFlow
            <span className="block text-accent/90">India</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl opacity-85 max-w-2xl mx-auto mb-4 font-sans leading-relaxed"
          >
            Understand Indian elections, government structures, and civic participation through interactive simulations and AI-powered learning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-sans mb-10"
          >
            {["Election Map", "Data Dashboard", "Voting Guide", "Simulator", "AI Assistant", "Civic Quiz"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-primary-foreground/60" />
                {item}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            <a
              href="#dashboard-heading"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary-foreground text-foreground text-sm font-semibold font-sans transition-all hover:shadow-xl hover:shadow-primary-foreground/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-foreground"
            >
              <Sparkles className="w-4 h-4" />
              Explore Dashboard
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <div className="civic-badge bg-primary-foreground/10 text-primary-foreground text-xs font-sans backdrop-blur-sm">
              ⚠️ Informational only — not affiliated with ECI
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

export default HeroSection;
