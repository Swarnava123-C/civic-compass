import { memo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, BarChart3, Users, MessageSquare, Trophy, Menu, X, Map, Clock, Zap } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Zap, path: "/" },
  { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/dashboard", sectionId: "dashboard-heading" },
  { id: "map", label: "Map", icon: Map, path: "/map", sectionId: "map-heading" },
  { id: "timeline", label: "Timeline", icon: Clock, path: "/timeline", sectionId: "timeline-heading" },
  { id: "simulator", label: "Simulator", icon: Users, path: "/simulator", sectionId: "simulator-heading" },
  { id: "assistant", label: "Assistant", icon: MessageSquare, path: "/assistant", sectionId: "chat-heading" },
  { id: "quiz", label: "Quiz", icon: Trophy, path: "/quiz", sectionId: "quiz-heading" },
];

const StickyNav = memo(function StickyNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = useCallback((item: typeof NAV_ITEMS[0]) => {
    setMobileOpen(false);
    if (location.pathname === "/") {
      // On home page, scroll to section
      if (item.sectionId) {
        const el = document.getElementById(item.sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      if (item.path !== "/") {
        navigate(item.path);
      }
    } else {
      navigate(item.path);
    }
  }, [navigate, location.pathname]);

  const isActive = (item: typeof NAV_ITEMS[0]) => {
    if (item.path === "/") return location.pathname === "/";
    return location.pathname === item.path;
  };

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50"
      aria-label="Section navigation"
    >
      <div className="container max-w-6xl mx-auto px-4">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between h-14">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-bold text-foreground font-sans tracking-tight flex items-center gap-2 hover:opacity-80 transition"
          >
            <span className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-accent-foreground text-xs">🇮🇳</span>
            CivicFlow India
          </button>
          <div className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium font-sans transition-all focus:outline-none focus:ring-2 focus:ring-ring flex items-center gap-1.5 ${
                    active
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center justify-between h-14">
          <button onClick={() => navigate("/")} className="text-sm font-bold text-foreground font-sans flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-accent-foreground text-[10px]">🇮🇳</span>
            CivicFlow
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-3 space-y-0.5 overflow-hidden"
            >
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item)}
                    className={`w-full px-3 py-2.5 rounded-lg text-sm font-sans text-left flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-ring transition ${
                      active
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
});

export default StickyNav;
