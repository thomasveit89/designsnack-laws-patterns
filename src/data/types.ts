export type PrincipleType = "ux_law" | "cognitive_bias" | "heuristic";

export interface Principle {
  id: string;
  type: PrincipleType;
  title: string;
  oneLiner: string;
  definition: string;
  appliesWhen: string[];
  do: string[];
  dont: string[];
  example?: {
    image: string;
    caption: string;
  };
  tags: string[];
  category: string;
  sources: string[];
}

export interface Category {
  id: string;
  label: string;
  description: string;
  color: string;
}

export interface QuizQuestion {
  id: string;
  principleId: string;
  question: string;
  answer: string;
  hint?: string;
}