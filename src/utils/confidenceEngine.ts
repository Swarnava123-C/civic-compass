import type { ConfidenceBreakdown, UserProfile } from "@/types/civic";

const STATE_PATTERN =
  /\b(andhra pradesh|arunachal pradesh|assam|bihar|chhattisgarh|goa|gujarat|haryana|himachal pradesh|jharkhand|karnataka|kerala|madhya pradesh|maharashtra|manipur|meghalaya|mizoram|nagaland|odisha|punjab|rajasthan|sikkim|tamil nadu|telangana|tripura|uttar pradesh|uttarakhand|west bengal|andaman|chandigarh|dadra|daman|diu|delhi|jammu|kashmir|ladakh|lakshadweep|puducherry|pondicherry)\b/i;

const PROCESS_PATTERN =
  /\b(register|registration|vote|voting|ballot|polling|evm|vvpat|epic|voter id|aadhaar|nomination|election|campaign|count|recount|result|form 6|nvsp|eci|lok sabha|rajya sabha|vidhan sabha|assembly|panchayat|municipal|nota|postal ballot|model code|mcc|booth)\b/i;

export function computeConfidenceBreakdown(
  input: string,
  profile?: UserProfile | null
): ConfidenceBreakdown {
  const normalized = input.trim();

  const hasState =
    STATE_PATTERN.test(normalized) ||
    (profile?.state !== undefined && profile?.state !== null);

  const hasProcess = PROCESS_PATTERN.test(normalized);

  const reasons: string[] = [];

  if (hasState && hasProcess) {
    reasons.push("Specific state/UT detected");
    reasons.push("Specific civic process detected");
    if (profile?.state !== undefined && profile?.state !== null) {
      reasons.push(`Personalized for ${profile.state.name}`);
    }
    return { level: "high", hasState, hasProcess, reasons };
  }

  if (hasProcess) {
    reasons.push("Specific civic process detected");
    reasons.push("Mentioning a state/UT would increase confidence");
    return { level: "medium", hasState, hasProcess, reasons };
  }

  reasons.push("Query is broad or general");
  reasons.push("Mention a civic process for better accuracy");
  reasons.push("Select a state/UT for personalization");

  return { level: "low", hasState, hasProcess, reasons };
}
