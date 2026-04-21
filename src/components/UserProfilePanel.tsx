import { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronDown, ChevronUp, MapPin, Calendar, HelpCircle } from "lucide-react";
import { INDIA_STATES_LIST } from "@/data/civicContent";
import type { UserProfile, StateInfo } from "@/types/civic";

interface UserProfilePanelProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const UserProfilePanel = memo(function UserProfilePanel({ profile, onUpdate, isOpen, onToggle }: UserProfilePanelProps) {
  const handleStateChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const code = e.target.value;
      const state: StateInfo | null = code ? INDIA_STATES_LIST.find((s) => s.code === code) ?? null : null;
      onUpdate({ ...profile, state });
    },
    [profile, onUpdate]
  );

  const handleAgeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      onUpdate({ ...profile, age: val ? parseInt(val, 10) || null : null });
    },
    [profile, onUpdate]
  );

  return (
    <div className="civic-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-ring rounded-2xl"
        aria-expanded={isOpen}
        aria-label="Toggle user profile panel"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
            <User className="w-4 h-4 text-accent" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground font-sans">Your Profile</span>
            <p className="text-xs text-muted-foreground font-sans">Personalize your civic experience</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="profile-state" className="text-xs font-medium text-foreground font-sans flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    Your State / UT
                  </label>
                  <select
                    id="profile-state"
                    value={profile.state?.code ?? ""}
                    onChange={handleStateChange}
                    className="w-full px-3 py-2 rounded-xl border bg-background text-foreground text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select State / Union Territory (India)</option>
                    {INDIA_STATES_LIST.map((s) => (
                      <option key={s.code} value={s.code}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="profile-age" className="text-xs font-medium text-foreground font-sans flex items-center gap-1.5 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    Your Age
                  </label>
                  <input
                    id="profile-age"
                    type="number"
                    min={16}
                    max={120}
                    value={profile.age ?? ""}
                    onChange={handleAgeChange}
                    placeholder="e.g., 21"
                    className="w-full px-3 py-2 rounded-xl border bg-background text-foreground text-sm font-sans focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-foreground font-sans flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-accent" />
                  I need help with…
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onUpdate({ ...profile, needsRegistrationHelp: !profile.needsRegistrationHelp })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium font-sans transition focus:outline-none focus:ring-2 focus:ring-ring ${
                      profile.needsRegistrationHelp ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                    aria-pressed={profile.needsRegistrationHelp}
                  >
                    Voter Registration
                  </button>
                  <button
                    onClick={() => onUpdate({ ...profile, needsIdHelp: !profile.needsIdHelp })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium font-sans transition focus:outline-none focus:ring-2 focus:ring-ring ${
                      profile.needsIdHelp ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                    aria-pressed={profile.needsIdHelp}
                  >
                    Voter ID (EPIC)
                  </button>
                </div>
              </div>

              {profile.age !== null && profile.age < 18 && (
                <div className="p-3 rounded-xl bg-civic-gold/10 text-xs text-foreground font-sans">
                  <strong>Note:</strong> You must be at least 18 years old on the qualifying date (1st January of the revision year) to register as a voter in India.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default UserProfilePanel;
