export interface TimelineStage {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
  duration: string;
  whoIsInvolved?: string[];
  legalSignificance?: string;
  citizenRole?: string;
  requiredDocuments?: string[];
}

export interface VotingStep {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  userActions: string[];
  icon: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  confidence?: "high" | "medium" | "low";
  structured?: StructuredAIResponse | null;
  parseError?: boolean;
}

export interface StateInfo {
  name: string;
  code: string;
}

export interface StateDetail {
  code: string;
  electionAuthority: string;
  electionAuthorityUrl: string;
  registrationPortal: string;
  votingAge: number;
  nextElection: string;
  notes: string;
}

export interface Scenario {
  id: string;
  title: string;
  icon: string;
  description: string;
  steps: ScenarioStep[];
  requiredForms?: string[];
  deadlines?: string;
  whereToApply?: string;
  warnings?: string[];
  officialResources?: string[];
}

export interface ScenarioStep {
  step: number;
  title: string;
  description: string;
}

export interface GovernmentBranch {
  id: string;
  name: string;
  icon: string;
  role: string;
  powers: string[];
  examples: string[];
  checksAndBalances: string[];
}

export interface StructuredAIResponse {
  summary: string;
  timeline_stage?: string;
  steps?: string[];
  documents_required?: string[];
  eligibility_rules?: string[];
  deadlines?: string;
  official_links?: string[];
  warnings?: string[];
  confidence_score?: string;
}

export type DetailLevel = "beginner" | "detailed";

export interface UserProfile {
  state: StateInfo | null;
  age: number | null;
  needsRegistrationHelp: boolean;
  needsIdHelp: boolean;
}

export interface ConfidenceBreakdown {
  level: "high" | "medium" | "low";
  hasState: boolean;
  hasProcess: boolean;
  reasons: string[];
}
