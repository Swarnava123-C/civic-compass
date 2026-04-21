import type { GovernmentBranch } from "@/types/civic";

export const GOVERNMENT_BRANCHES: GovernmentBranch[] = [
  {
    id: "executive",
    name: "Executive Branch",
    icon: "🏛️",
    role: "Enforces and implements laws. Led by the President at the federal level and governors at the state level.",
    powers: [
      "Signs or vetoes legislation",
      "Commands the armed forces",
      "Negotiates treaties and foreign policy",
      "Appoints federal judges and cabinet members",
      "Issues executive orders",
    ],
    examples: [
      "President of the United States",
      "Vice President",
      "Cabinet secretaries (State, Defense, Treasury, etc.)",
      "Federal agencies (EPA, FBI, NASA)",
    ],
    checksAndBalances: [
      "Congress can override vetoes with 2/3 majority",
      "Senate must confirm appointments",
      "Congress controls the budget",
      "Can be impeached by Congress",
      "Courts can rule executive actions unconstitutional",
    ],
  },
  {
    id: "legislative",
    name: "Legislative Branch",
    icon: "📜",
    role: "Creates laws, controls the federal budget, and provides oversight of the executive branch. Consists of the Senate and House of Representatives.",
    powers: [
      "Writes and passes federal laws",
      "Declares war",
      "Controls federal spending and taxation",
      "Confirms presidential appointments (Senate)",
      "Impeaches federal officials",
      "Ratifies treaties (Senate)",
    ],
    examples: [
      "U.S. Senate (100 members, 2 per state)",
      "U.S. House of Representatives (435 members, proportional)",
      "Congressional committees and subcommittees",
    ],
    checksAndBalances: [
      "President can veto legislation",
      "Courts can strike down laws as unconstitutional",
      "Both chambers must agree on legislation",
      "Elections hold members accountable to voters",
    ],
  },
  {
    id: "judicial",
    name: "Judicial Branch",
    icon: "⚖️",
    role: "Interprets laws and the Constitution. Resolves legal disputes and ensures laws comply with the Constitution.",
    powers: [
      "Interprets the Constitution",
      "Reviews laws for constitutionality (judicial review)",
      "Resolves disputes between states",
      "Hears appeals from lower courts",
      "Issues rulings that set legal precedent",
    ],
    examples: [
      "Supreme Court of the United States (9 justices)",
      "U.S. Courts of Appeals (13 circuits)",
      "U.S. District Courts (94 districts)",
      "Specialized courts (Tax Court, Bankruptcy Courts)",
    ],
    checksAndBalances: [
      "President nominates judges",
      "Senate confirms judicial appointments",
      "Congress can amend the Constitution to override rulings",
      "Congress sets the number of Supreme Court justices",
      "Judges can be impeached by Congress",
    ],
  },
];
