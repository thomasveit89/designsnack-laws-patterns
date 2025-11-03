import { Principle, QuizQuestion, QuizLength } from '../data/types';
import { ApiService } from './api';
import { QuestionCacheService } from './questionCache';
import { QuestionHistoryService } from './questionHistory';
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

  // Get recently used question IDs to exclude
  const excludeIds = QuestionHistoryService.getExcludeIds(principleIds, actualCount);

  try {
    console.log(`🌐 Fetching ${actualCount} questions from backend API (excluding ${excludeIds.length} recent)...`);

    // Try to get questions from backend API
    const response = await ApiService.getQuestions({
      principleIds,
      limit: actualCount,
      difficulty: 'medium',
      excludeIds: excludeIds.length > 0 ? excludeIds : undefined
    });

    if (response.success && response.questions.length > 0) {
      console.log(`✅ Retrieved ${response.questions.length} questions from API`);

      // Check if we got enough questions
      if (response.questions.length < actualCount) {
        console.warn(`⚠️ Only got ${response.questions.length}/${actualCount} questions. Pool may be exhausted.`);

        // Try to generate new questions to fill the gap
        const missingCount = actualCount - response.questions.length;
        const generatedQuestions = await tryGenerateNewQuestions(principleIds, missingCount);

        if (generatedQuestions.length > 0) {
          console.log(`✨ Generated ${generatedQuestions.length} new questions to fill the gap`);
          const combinedQuestions = [...response.questions, ...generatedQuestions];

          // Cache all questions
          QuestionCacheService.updateCache(combinedQuestions, principleIds);
          return combinedQuestions;
        }
      }

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

    // If we have some cached but not enough, try to generate more
    if (cachedQuestions.length > 0 && cachedQuestions.length < actualCount) {
      console.warn(`⚠️ Only ${cachedQuestions.length}/${actualCount} cached questions available`);

      const missingCount = actualCount - cachedQuestions.length;
      const generatedQuestions = await tryGenerateNewQuestions(principleIds, missingCount);

      if (generatedQuestions.length > 0) {
        console.log(`✨ Generated ${generatedQuestions.length} new questions to supplement cache`);
        return [...cachedQuestions, ...generatedQuestions];
      }
    }

    // If no cached questions available, use fallback questions
    console.warn('⚠️ No cached questions available, using fallback questions');
    return getFallbackQuizQuestions(selectedPrinciples, length);
  }
}

/**
 * Try to generate new questions via the backend API
 */
async function tryGenerateNewQuestions(principleIds: string[], count: number): Promise<QuizQuestion[]> {
  try {
    console.log(`🤖 Triggering ChatGPT to generate ${count} new questions...`);

    const response = await ApiService.generateQuestions({
      principleIds,
      questionsPerPrinciple: Math.ceil(count / principleIds.length),
      difficulty: 'medium'
    });

    if (response.success && response.questions.length > 0) {
      console.log(`✅ ChatGPT generated ${response.questions.length} new questions`);
      return response.questions.slice(0, count);
    }

    return [];
  } catch (error) {
    console.warn('Failed to generate new questions:', error);
    return [];
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