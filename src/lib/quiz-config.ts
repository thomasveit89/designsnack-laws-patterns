import { QuizLength } from '../data/types';

export interface QuizLengthConfig {
  questions: number;
  label: string;
  description: string;
  emoji: string;
}

export const QUIZ_LENGTHS: Record<QuizLength, QuizLengthConfig> = {
  quick: {
    questions: 10,
    label: 'Quick Quiz',
    description: 'Perfect for a coffee break',
    emoji: '☕'
  },
  standard: {
    questions: 25,
    label: 'Standard Quiz',
    description: 'Balanced practice session',
    emoji: '📚'
  },
  complete: {
    questions: 50,
    label: 'Complete Quiz',
    description: 'Comprehensive review',
    emoji: '🎯'
  },
  marathon: {
    questions: 103,
    label: 'Marathon Quiz',
    description: 'Ultimate challenge - all principles!',
    emoji: '🏆'
  }
};

export const getQuizLengthConfig = (length: QuizLength): QuizLengthConfig => {
  return QUIZ_LENGTHS[length];
};

export const getQuestionCount = (length: QuizLength): number => {
  return QUIZ_LENGTHS[length].questions;
};