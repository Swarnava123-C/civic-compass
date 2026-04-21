export interface TimelineStage {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
  duration: string;
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
}

export interface StateInfo {
  name: string;
  code: string;
}

export type DetailLevel = "beginner" | "detailed";
