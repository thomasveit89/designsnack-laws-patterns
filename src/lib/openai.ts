import { Principle, QuizQuestion, QuizLength } from '../data/types';
import { ApiService } from './api';
import { QuestionCacheService } from './questionCache';
import { getQuestionCount } from './quiz-config';

/**
 * Generate quiz questions using the backend API
 * Falls back to cached questions if API is unavailable
 */
export async function generateQuizQuestions(principles: Principle[], length: QuizLength): Promise<QuizQuestion[]> {
  const requestedCount = getQuestionCount(length);

  // For marathon mode, use all available principles; for others, select randomly
  let selectedPrinciples: Principle[];
  if (length === 'marathon') {
    selectedPrinciples = principles;
  } else {
    selectedPrinciples = principles
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(requestedCount, principles.length));
  }

  const principleIds = selectedPrinciples.map(p => p.id);
  const actualCount = Math.min(requestedCount, selectedPrinciples.length);

  try {
    console.log(`🌐 Fetching ${actualCount} questions from backend API...`);

    // Try to get questions from backend API
    const response = await ApiService.getQuestions({
      principleIds,
      limit: actualCount,
      difficulty: 'medium'
    });

    if (response.success && response.questions.length > 0) {
      console.log(`✅ Retrieved ${response.questions.length} questions from API`);

      // Cache the questions for offline use
      QuestionCacheService.updateCache(response.questions, principleIds);

      return response.questions;
    } else {
      throw new Error('No questions returned from API');
    }

  } catch (apiError) {
    console.warn('🔄 Backend API unavailable, falling back to cached questions...');

    // Try to use cached questions first
    const cachedQuestions = QuestionCacheService.getRandomCachedQuestions(principleIds, actualCount);
    if (cachedQuestions.length >= actualCount) {
      console.log(`📦 Using ${cachedQuestions.length} cached questions`);
      return cachedQuestions;
    }

    // If no cached questions available, use fallback questions
    console.warn('⚠️ No cached questions available, using fallback questions');
    return getFallbackQuizQuestions(selectedPrinciples, length);
  }
}

// Fallback quiz questions in case API fails
export function getFallbackQuizQuestions(principles: Principle[], length: QuizLength): QuizQuestion[] {
  const requestedCount = getQuestionCount(length);
  const actualCount = Math.min(requestedCount, principles.length);

  // For marathon mode, use all principles; for others, use requested amount
  const selectedPrinciples = length === 'marathon'
    ? principles
    : principles.slice(0, actualCount);

  return selectedPrinciples.map((principle, index) => {
    // Create the options array
    const options = [
      "Users prefer complex interfaces with many options",
      "Design should always prioritize aesthetics over functionality",
      "All users behave exactly the same way",
      principle.oneLiner // Correct answer
    ];

    // Randomize the position of the correct answer
    const correctAnswerIndex = Math.floor(Math.random() * options.length);

    // Move correct answer to random position
    const correctAnswer = options.pop()!; // Remove correct answer from end
    options.splice(correctAnswerIndex, 0, correctAnswer); // Insert at random position

    return {
      id: `fallback_${principle.id}_${index}`,
      principleId: principle.id,
      question: `What is the main idea behind ${principle.title}?`,
      options: options,
      correctAnswer: correctAnswerIndex,
      explanation: `The correct answer is: "${principle.oneLiner}"`
    };
  });
}