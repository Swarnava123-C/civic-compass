import { memo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen, BarChart3, Users, MessageSquare, Trophy, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "overview-heading", label: "Overview", icon: BookOpen },
  { id: "timeline-heading", label: "Timeline", icon: BarChart3 },
  { id: "simulator-heading", label: "Simulator", icon: Users },
  { id: "gov-heading", label: "Government", icon: Users },
  { id: "chat-heading", label: "Assistant", icon: MessageSquare },
  { id: "quiz-heading", label: "Quiz", icon: Trophy },
];

const StickyNav = memo(function StickyNav() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0.1 }
    );

    for (const item of NAV_ITEMS) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    }
  }, []);

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-30 civic-glass border-b"
      aria-label="Section navigation"
    >
      <div className="container max-w-5xl mx-auto px-4">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between h-12">
          <span className="text-sm font-bold text-foreground font-sans tracking-tight">CivicFlow Pro</span>
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans transition-all focus:outline-none focus:ring-2 focus:ring-ring flex items-center gap-1.5 ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center justify-between h-12">
          <span className="text-sm font-bold text-foreground font-sans">CivicFlow Pro</span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-3 space-y-1"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="w-full px-3 py-2 rounded-lg text-sm font-sans text-left flex items-center gap-2 text-muted-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
});

export default StickyNav;
