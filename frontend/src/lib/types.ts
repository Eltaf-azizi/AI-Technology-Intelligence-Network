export interface Technology {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  learningTime: string;
  prerequisites: string[];
  skills: string[];
  applications: string[];
  companies: string[];
  futureOutlook: "Growing" | "Stable" | "Declining";
  growthRate: number;
  popularity: number;
  icon: string;
  color: string;
}

export interface Relationship {
  source: string;
  target: string;
  type: string;
  strength: number;
}

export interface KnowledgeGraph {
  technologies: Technology[];
  relationships: Relationship[];
}

export interface LearningPath {
  id: string;
  title: string;
  goal: string;
  steps: LearningStep[];
}

export interface LearningStep {
  id: string;
  technologyId: string;
  name: string;
  difficulty: string;
  estimatedTime: string;
  resources: string[];
  completed?: boolean;
}

export interface Career {
  id: string;
  title: string;
  description: string;
  demand: "High" | "Medium" | "Low";
  salaryRange: string;
  skills: string[];
  learningOrder: string[];
  projects: string[];
  estimatedTime: string;
  growth: number;
}

export interface TrendData {
  name: string;
  category: string;
  growth: number;
  momentum: number;
  stage: "Emerging" | "Growing" | "Mature" | "Declining";
}

export interface ComparisonResult {
  tech1: string;
  tech2: string;
  strengths: Record<string, string>;
  weaknesses: Record<string, string>;
  useCases: Record<string, string>;
  learningCurve: Record<string, string>;
  adoption: Record<string, string>;
}

export interface MentorMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  summary: string;
  technologies: string[];
  concepts: string[];
  difficulty: string;
}
