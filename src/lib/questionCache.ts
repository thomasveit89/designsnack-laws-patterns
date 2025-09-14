import { QuizQuestion } from '../data/types';
import { storage } from './storage';
import { config } from './config';

// Cache keys
const CACHE_KEYS = {
  questions: 'cached_questions',
  lastSync: 'questions_last_sync',
  syncData: 'questions_sync_data'
} as const;

export interface CachedQuestionData {
  questions: QuizQuestion[];
  timestamp: number;
  principleIds: string[];
  totalCached: number;
}

export interface SyncStatus {
  lastSyncTime: number;
  totalCached: number;
  needsSync: boolean;
}

export class QuestionCacheService {
  
  // Check if cache is valid and has sufficient questions
  static isCacheValid(): boolean {
    try {
      if (!storage) {
        console.warn('Storage not initialized');
        return false;
      }
      
      const lastSyncStr = storage.getString(CACHE_KEYS.lastSync);
      if (!lastSyncStr) return false;

      const lastSync = parseInt(lastSyncStr);
      const now = Date.now();
      const age = now - lastSync;

      // Check if cache is within valid age
      if (age > config.cache.maxAge) return false;

      // Check if we have cached questions
      const cached = this.getCachedQuestions();
      return cached.length >= 10; // Need at least 10 questions for a quiz

    } catch (error) {
      console.error('Error checking cache validity:', error);
      return false;
    }
  }

  // Get cached questions
  static getCachedQuestions(): QuizQuestion[] {
    try {
      if (!storage) {
        console.warn('Storage not initialized');
        return [];
      }
      
      const questionsStr = storage.getString(CACHE_KEYS.questions);
      if (!questionsStr) return [];

      const cachedData: CachedQuestionData = JSON.parse(questionsStr);
      return cachedData.questions || [];
    } catch (error) {
      console.error('Error loading cached questions:', error);
      return [];
    }
  }

  // Cache questions from API response
  static cacheQuestions(questions: QuizQuestion[], principleIds: string[]): void {
    try {
      const cachedData: CachedQuestionData = {
        questions,
        timestamp: Date.now(),
        principleIds,
        totalCached: questions.length
      };

      storage.set(CACHE_KEYS.questions, JSON.stringify(cachedData));
      storage.set(CACHE_KEYS.lastSync, Date.now().toString());

      console.log(`✅ Cached ${questions.length} questions for offline use`);
    } catch (error) {
      console.error('Error caching questions:', error);
    }
  }

  // Get random questions from cache
  static getRandomCachedQuestions(
    principleIds: string[],
    limit: number = 10
  ): QuizQuestion[] {
    try {
      const allCached = this.getCachedQuestions();
      
      // Filter by principle IDs if provided
      let filtered = allCached;
      if (principleIds.length > 0) {
        filtered = allCached.filter(q => principleIds.includes(q.principleId));
      }

      // Shuffle and take requested number
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Error getting random cached questions:', error);
      return [];
    }
  }

  // Get sync status
  static getSyncStatus(): SyncStatus {
    try {
      const lastSyncStr = storage.getString(CACHE_KEYS.lastSync);
      const lastSyncTime = lastSyncStr ? parseInt(lastSyncStr) : 0;
      const cached = this.getCachedQuestions();
      const age = Date.now() - lastSyncTime;

      return {
        lastSyncTime,
        totalCached: cached.length,
        needsSync: age > config.cache.maxAge || cached.length < config.cache.minQuestions
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        lastSyncTime: 0,
        totalCached: 0,
        needsSync: true
      };
    }
  }

  // Clear cache
  static clearCache(): void {
    try {
      storage.delete(CACHE_KEYS.questions);
      storage.delete(CACHE_KEYS.lastSync);
      storage.delete(CACHE_KEYS.syncData);
      console.log('🗑️ Question cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Update cache with new questions (merge with existing)
  static updateCache(newQuestions: QuizQuestion[], principleIds: string[]): void {
    try {
      const existing = this.getCachedQuestions();
      const existingIds = new Set(existing.map(q => q.id));
      
      // Add only new questions
      const uniqueNew = newQuestions.filter(q => !existingIds.has(q.id));
      const updated = [...existing, ...uniqueNew];

      // Limit total cached questions
      const limited = updated.slice(0, config.cache.maxQuestions);

      this.cacheQuestions(limited, principleIds);
    } catch (error) {
      console.error('Error updating cache:', error);
    }
  }

  // Get cache statistics
  static getCacheStats(): {
    totalQuestions: number;
    lastSync: Date | null;
    age: number;
    isValid: boolean;
  } {
    try {
      const questions = this.getCachedQuestions();
      const lastSyncStr = storage.getString(CACHE_KEYS.lastSync);
      const lastSyncTime = lastSyncStr ? parseInt(lastSyncStr) : 0;
      const lastSync = lastSyncTime > 0 ? new Date(lastSyncTime) : null;
      const age = lastSyncTime > 0 ? Date.now() - lastSyncTime : 0;

      return {
        totalQuestions: questions.length,
        lastSync,
        age,
        isValid: this.isCacheValid()
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        totalQuestions: 0,
        lastSync: null,
        age: 0,
        isValid: false
      };
    }
  }
}