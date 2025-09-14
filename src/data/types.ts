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
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  explanation?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizSession {
  id: string;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  currentQuestionIndex: number;
  startTime: Date;
  endTime?: Date;
  score: number;
  mode: 'all' | 'favorites';
  principlesUsed: string[];
}

export interface QuizResult {
  session: QuizSession;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  averageTimePerQuestion: number;
}