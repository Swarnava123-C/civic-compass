import type { ConfidenceBreakdown, UserProfile } from "@/types/civic";

const STATE_PATTERN = /\b(andhra pradesh|arunachal pradesh|assam|bihar|chhattisgarh|goa|gujarat|haryana|himachal pradesh|jharkhand|karnataka|kerala|madhya pradesh|maharashtra|manipur|meghalaya|mizoram|nagaland|odisha|punjab|rajasthan|sikkim|tamil nadu|telangana|tripura|uttar pradesh|uttarakhand|west bengal|andaman|chandigarh|dadra|daman|diu|delhi|jammu|kashmir|ladakh|lakshadweep|puducherry|pondicherry)\b/i;

const PROCESS_PATTERN = /\b(register|registration|vote|voting|ballot|polling|evm|vvpat|epic|voter id|aadhaar|nomination|election|campaign|count|recount|result|form 6|nvsp|eci|lok sabha|rajya sabha|vidhan sabha|assembly|panchayat|municipal|nota|postal ballot|model code|mcc|booth)\b/i;

export function computeConfidenceBreakdown(
  input: string,
  profile?: UserProfile | null
): ConfidenceBreakdown {
  const hasState = STATE_PATTERN.test(input) || (profile?.state != null);
  const hasProcess = PROCESS_PATTERN.test(input);
  const reasons: string[] = [];

  if (hasState && hasProcess) {
    reasons.push("Your question mentions a specific state/UT or you have one selected");
    reasons.push("Your question targets a specific civic process");
    if (profile?.state) {
      reasons.push(`Personalized for ${profile.state.name}`);
    }
    return { level: "high", hasState, hasProcess, reasons };
  }

  if (hasProcess) {
    reasons.push("Your question targets a specific civic process");
    reasons.push("Adding a state/UT would increase confidence to High");
    return { level: "medium", hasState, hasProcess, reasons };
  }

  reasons.push("Your question is broad or general");
  reasons.push("Try mentioning a specific process (e.g., voter registration, EVM, NOTA)");
  reasons.push("Select a state/UT for personalized results");
  return { level: "low", hasState, hasProcess, reasons };
}
