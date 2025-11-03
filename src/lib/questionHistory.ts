import { storage } from './storage';

/**
 * Service to track recently used questions and prevent duplicates in quizzes
 */

const QUESTION_HISTORY_KEY = 'quiz_question_history';
const MAX_HISTORY_SIZE = 100; // Keep track of last 100 questions

export class QuestionHistoryService {
  /**
   * Get list of recently used question IDs
   */
  static getRecentQuestionIds(): string[] {
    try {
      const historyJson = storage.getString(QUESTION_HISTORY_KEY);
      if (!historyJson) return [];

      const history = JSON.parse(historyJson);
      return Array.isArray(history) ? history : [];
    } catch (error) {
      console.error('Failed to load question history:', error);
      return [];
    }
  }

  /**
   * Add questions to history (call after quiz completion)
   */
  static addQuestionsToHistory(questionIds: string[]): void {
    try {
      const currentHistory = this.getRecentQuestionIds();

      // Add new questions to the beginning
      const updatedHistory = [...questionIds, ...currentHistory];

      // Keep only the most recent MAX_HISTORY_SIZE questions
      const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_SIZE);

      // Remove duplicates while preserving order
      const uniqueHistory = Array.from(new Set(trimmedHistory));

      storage.set(QUESTION_HISTORY_KEY, JSON.stringify(uniqueHistory));

      console.log(`📝 Added ${questionIds.length} questions to history (total: ${uniqueHistory.length})`);
    } catch (error) {
      console.error('Failed to save question history:', error);
    }
  }

  /**
   * Get question IDs to exclude for a specific principle pool
   * Returns a subset of recent questions to ensure fresh questions while allowing repeats eventually
   */
  static getExcludeIds(availablePrincipleIds: string[], questionCount: number): string[] {
    const recentIds = this.getRecentQuestionIds();

    // If no history, nothing to exclude
    if (recentIds.length === 0) return [];

    // Smart exclusion based on quiz size and history
    let excludeRatio: number;

    if (questionCount <= 5) {
      // Small quiz (quick): exclude up to 70% of recent questions
      excludeRatio = 0.7;
    } else if (questionCount <= 10) {
      // Medium quiz (standard): exclude 50%
      excludeRatio = 0.5;
    } else {
      // Large quiz (marathon): exclude only 30% to have more variety
      excludeRatio = 0.3;
    }

    // Calculate max questions to exclude
    const maxExclude = Math.floor(recentIds.length * excludeRatio);

    // But don't exclude more than 3x the quiz size to ensure we have enough pool
    const safeExclude = Math.min(maxExclude, questionCount * 3);

    return recentIds.slice(0, safeExclude);
  }

  /**
   * Clear question history (useful for testing or reset)
   */
  static clearHistory(): void {
    try {
      storage.delete(QUESTION_HISTORY_KEY);
      console.log('✅ Question history cleared');
    } catch (error) {
      console.error('Failed to clear question history:', error);
    }
  }

  /**
   * Get statistics about question history
   */
  static getStats(): { totalTracked: number; oldestId: string | null; newestId: string | null } {
    const history = this.getRecentQuestionIds();
    return {
      totalTracked: history.length,
      newestId: history[0] || null,
      oldestId: history[history.length - 1] || null
    };
  }
}
