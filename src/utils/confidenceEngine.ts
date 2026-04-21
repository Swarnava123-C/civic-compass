import type { ConfidenceBreakdown, UserProfile } from "@/types/civic";

const STATE_PATTERN = /\b(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming)\b/i;

const PROCESS_PATTERN = /\b(register|registration|vote|voting|ballot|polling|absentee|primary|election|campaign|count|recount|certif|mail-in|provisional|ID|identification)\b/i;

export function computeConfidenceBreakdown(
  input: string,
  profile?: UserProfile | null
): ConfidenceBreakdown {
  const hasState = STATE_PATTERN.test(input) || (profile?.state != null);
  const hasProcess = PROCESS_PATTERN.test(input);
  const reasons: string[] = [];

  if (hasState && hasProcess) {
    reasons.push("Your question mentions a specific state or you have one selected");
    reasons.push("Your question targets a specific civic process");
    if (profile?.state) {
      reasons.push(`Personalized for ${profile.state.name}`);
    }
    return { level: "high", hasState, hasProcess, reasons };
  }

  if (hasProcess) {
    reasons.push("Your question targets a specific civic process");
    reasons.push("Adding a state would increase confidence to High");
    return { level: "medium", hasState, hasProcess, reasons };
  }

  reasons.push("Your question is broad or general");
  reasons.push("Try mentioning a specific process (e.g., registration, absentee ballot)");
  reasons.push("Select a state for personalized results");
  return { level: "low", hasState, hasProcess, reasons };
}
