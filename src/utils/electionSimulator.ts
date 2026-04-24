/**
 * Mock Election Simulator — FPTP seat allocation logic
 * Neutral, educational simulation only. No predictions.
 */

export interface PartyInput {
  name: string;
  voteSharePercent: number;
}

export interface SimulationResult {
  partySeats: { name: string; seats: number; voteShare: number }[];
  totalSeats: number;
  majorityMark: number;
  hasOutrightMajority: boolean;
  majorityParty: string | null;
  isHungAssembly: boolean;
  coalitionSuggestion: string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateVoteShares(parties: PartyInput[]): ValidationError[] {
  const errors: ValidationError[] = [];
  if (parties.length < 2) {
    errors.push({ field: "parties", message: "At least 2 parties required" });
  }
  if (parties.length > 6) {
    errors.push({ field: "parties", message: "Maximum 6 parties allowed" });
  }
  const total = parties.reduce((s, p) => s + p.voteSharePercent, 0);
  if (Math.abs(total - 100) > 0.5) {
    errors.push({ field: "voteShare", message: `Vote shares must sum to 100% (current: ${total.toFixed(1)}%)` });
  }
  for (const p of parties) {
    if (!p.name.trim()) {
      errors.push({ field: "partyName", message: "Party name cannot be empty" });
    }
    if (p.voteSharePercent < 0 || p.voteSharePercent > 100) {
      errors.push({ field: "voteShare", message: `${p.name}: vote share must be 0-100%` });
    }
  }
  return errors;
}

/**
 * Simplified FPTP simulation:
 * - Uses a probabilistic model based on vote share
 * - Higher vote share = higher probability of winning each constituency
 * - Includes random variance to simulate real-world FPTP dynamics
 * - This is educational only; real elections depend on constituency-level demographics
 */
export function simulateElection(
  totalSeats: number,
  parties: PartyInput[],
  swingPercent: number = 0
): SimulationResult {
  const majorityMark = Math.floor(totalSeats / 2) + 1;

  // Apply swing to first party (educational simplification)
  const adjusted = parties.map((p, i) => ({
    ...p,
    voteSharePercent: i === 0
      ? Math.max(0, Math.min(100, p.voteSharePercent + swingPercent))
      : p.voteSharePercent,
  }));

  // Renormalize after swing
  const totalShare = adjusted.reduce((s, p) => s + p.voteSharePercent, 0);
  const normalized = adjusted.map(p => ({
    ...p,
    voteSharePercent: (p.voteSharePercent / totalShare) * 100,
  }));

  // FPTP simulation: use cube rule approximation
  // Seat share ≈ (vote share)^3 / Σ(vote share)^3
  const cubed = normalized.map(p => Math.pow(p.voteSharePercent / 100, 3));
  const cubedTotal = cubed.reduce((s, v) => s + v, 0);

  const seatAllocation = normalized.map((p, i) => ({
    name: p.name,
    rawSeats: cubedTotal > 0 ? (cubed[i] / cubedTotal) * totalSeats : 0,
    voteShare: p.voteSharePercent,
  }));

  // Round using largest remainder method
  const flooredSeats = seatAllocation.map(p => Math.floor(p.rawSeats));
  const remaining = totalSeats - flooredSeats.reduce((s, v) => s + v, 0);
  const remainders = seatAllocation.map((p, i) => ({
    index: i,
    remainder: p.rawSeats - flooredSeats[i],
  }));
  remainders.sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < remaining; i++) {
    flooredSeats[remainders[i].index]++;
  }

  const partySeats = seatAllocation.map((p, i) => ({
    name: p.name,
    seats: flooredSeats[i],
    voteShare: Math.round(p.voteShare * 10) / 10,
  }));

  partySeats.sort((a, b) => b.seats - a.seats);

  const topParty = partySeats[0];
  const hasOutrightMajority = topParty.seats >= majorityMark;

  let coalitionSuggestion: string | null = null;
  if (!hasOutrightMajority && partySeats.length >= 2) {
    // Find smallest coalition that achieves majority
    let coalitionSeats = topParty.seats;
    const coalitionMembers = [topParty.name];
    for (let i = 1; i < partySeats.length && coalitionSeats < majorityMark; i++) {
      coalitionSeats += partySeats[i].seats;
      coalitionMembers.push(partySeats[i].name);
    }
    if (coalitionSeats >= majorityMark) {
      coalitionSuggestion = `Possible coalition: ${coalitionMembers.join(" + ")} (${coalitionSeats} seats)`;
    }
  }

  return {
    partySeats,
    totalSeats,
    majorityMark,
    hasOutrightMajority,
    majorityParty: hasOutrightMajority ? topParty.name : null,
    isHungAssembly: !hasOutrightMajority,
    coalitionSuggestion,
  };
}
