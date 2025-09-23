import { Principle, QuizQuestion } from '../data/types';
import { ApiService } from './api';
import { QuestionCacheService } from './questionCache';

/**
 * Generate quiz questions using the backend API
 * Falls back to cached questions if API is unavailable
 */
export async function generateQuizQuestions(principles: Principle[]): Promise<QuizQuestion[]> {
  // Select 10 random principles for the quiz
  const selectedPrinciples = principles
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  const principleIds = selectedPrinciples.map(p => p.id);

  try {
    console.log('🌐 Fetching questions from backend API...');
    
    // Try to get questions from backend API
    const response = await ApiService.getQuestions({
      principleIds,
      limit: 10,
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
    console.warn('🔄 Backend API unavailable, trying cached questions:', apiError);
    
    // Fall back to cached questions
    const cachedQuestions = QuestionCacheService.getRandomCachedQuestions(principleIds, 10);
    
    if (cachedQuestions.length >= 10) {
      console.log(`📦 Using ${cachedQuestions.length} cached questions`);
      return cachedQuestions;
    }

    // Final fallback to simple questions
    console.warn('⚠️ No cached questions available, using fallback questions');
    return getFallbackQuizQuestions(selectedPrinciples);
  }
}

// Fallback quiz questions in case API fails
export function getFallbackQuizQuestions(principles: Principle[]): QuizQuestion[] {
  const selectedPrinciples = principles.slice(0, 10);

  return selectedPrinciples.map((principle, index) => {
    // Create the options with the correct answer first
    const options = [
      principle.oneLiner,
      "Users prefer complex interfaces with many options",
      "Design should always prioritize aesthetics over functionality",
      "All users behave exactly the same way"
    ];

    // Randomize the position of the correct answer
    const correctAnswerIndex = Math.floor(Math.random() * options.length);

    // Shuffle the options while keeping track of correct answer position
    const shuffledOptions = [...options];
    if (correctAnswerIndex !== 0) {
      // Swap the correct answer to the random position
      [shuffledOptions[0], shuffledOptions[correctAnswerIndex]] = [shuffledOptions[correctAnswerIndex], shuffledOptions[0]];
    }

    return {
      id: `fallback_${principle.id}_${index}`,
      principleId: principle.id,
      question: `What is the main idea behind ${principle.title}?`,
      options: shuffledOptions,
      correctAnswer: correctAnswerIndex,
      explanation: `The correct answer is: "${principle.oneLiner}"`
    };
  });
}