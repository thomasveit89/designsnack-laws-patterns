import { create } from 'zustand';
import { QuizSession, QuizQuestion, QuizAnswer, QuizResult, Principle, QuizLength } from '../data/types';
import { generateQuizQuestions, getFallbackQuizQuestions } from '../lib/openai';
import { storage } from '../lib/storage';
import { SyncService } from '../lib/syncService';
import { QuestionCacheService } from '../lib/questionCache';
import { QuestionHistoryService } from '../lib/questionHistory';
import { config } from '../lib/config';
import { getQuestionCount } from '../lib/quiz-config';

interface QuizState {
  // Current session state
  currentSession: QuizSession | null;
  isLoading: boolean;
  error: string | null;
  
  // Quiz history
  completedSessions: QuizResult[];
  
  // Sync state
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
  
  // Actions
  startNewQuiz: (principles: Principle[], mode: 'all' | 'favorites', length: QuizLength) => Promise<void>;
  answerQuestion: (questionId: string, selectedAnswer: number) => void;
  goToQuestion: (index: number) => void;
  submitQuiz: () => QuizResult | null;
  resetQuiz: () => void;
  loadQuizHistory: () => void;
  clearError: () => void;
  
  // Sync actions
  syncQuestions: (principleIds: string[]) => Promise<void>;
  initializeSync: (principleIds: string[]) => Promise<void>;
  getSyncStatus: () => { lastSync: Date | null; needsSync: boolean; totalCached: number };
  clearSyncError: () => void;
}

const QUIZ_HISTORY_KEY = 'quiz_history';

export const useQuiz = create<QuizState>((set, get) => ({
  currentSession: null,
  isLoading: false,
  error: null,
  completedSessions: [],
  
  // Sync state
  isSyncing: false,
  lastSyncTime: null,
  syncError: null,

  startNewQuiz: async (principles: Principle[], mode: 'all' | 'favorites', length: QuizLength) => {
    set({ isLoading: true, error: null });

    try {
      let questions: QuizQuestion[];

      try {
        // Try to generate questions using OpenAI
        questions = await generateQuizQuestions(principles, length);
      } catch (apiError) {
        console.warn('OpenAI API failed, using fallback questions:', apiError);
        // Fall back to simple questions if API fails
        questions = getFallbackQuizQuestions(principles, length);
      }

      const newSession: QuizSession = {
        id: `quiz_${Date.now()}`,
        questions,
        answers: [],
        currentQuestionIndex: 0,
        startTime: new Date(),
        score: 0,
        mode,
        length,
        principlesUsed: questions.map(q => q.principleId),
      };

      set({
        currentSession: newSession,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Failed to start quiz:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate quiz questions'
      });
    }
  },

  answerQuestion: (questionId: string, selectedAnswer: number) => {
    const state = get();
    if (!state.currentSession) return;
    
    const question = state.currentSession.questions.find(q => q.id === questionId);
    if (!question) return;
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    const newAnswer: QuizAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      timeSpent: 0, // TODO: Calculate actual time spent
    };
    
    // Update or add the answer
    const existingAnswerIndex = state.currentSession.answers.findIndex(a => a.questionId === questionId);
    let updatedAnswers: QuizAnswer[];
    
    if (existingAnswerIndex >= 0) {
      // Update existing answer
      updatedAnswers = [...state.currentSession.answers];
      updatedAnswers[existingAnswerIndex] = newAnswer;
    } else {
      // Add new answer
      updatedAnswers = [...state.currentSession.answers, newAnswer];
    }
    
    // Update score
    const score = updatedAnswers.filter(a => a.isCorrect).length;
    
    set({
      currentSession: {
        ...state.currentSession,
        answers: updatedAnswers,
        score,
      }
    });
  },

  goToQuestion: (index: number) => {
    const state = get();
    if (!state.currentSession || index < 0 || index >= state.currentSession.questions.length) {
      return;
    }
    
    set({
      currentSession: {
        ...state.currentSession,
        currentQuestionIndex: index,
      }
    });
  },

  submitQuiz: () => {
    const state = get();
    if (!state.currentSession) return null;
    
    const endTime = new Date();
    const totalTimeMs = endTime.getTime() - state.currentSession.startTime.getTime();
    const averageTimePerQuestion = totalTimeMs / state.currentSession.questions.length;
    
    const completedSession: QuizSession = {
      ...state.currentSession,
      endTime,
    };
    
    const result: QuizResult = {
      session: completedSession,
      totalQuestions: completedSession.questions.length,
      correctAnswers: completedSession.score,
      scorePercentage: Math.round((completedSession.score / completedSession.questions.length) * 100),
      averageTimePerQuestion: Math.round(averageTimePerQuestion / 1000), // Convert to seconds
    };

    // Add questions to history to prevent duplicates in future quizzes
    const questionIds = completedSession.questions.map(q => q.id);
    QuestionHistoryService.addQuestionsToHistory(questionIds);

    // Save to history
    const updatedHistory = [...state.completedSessions, result];
    set({
      completedSessions: updatedHistory,
      currentSession: null,
    });

    // Persist to storage
    try {
      storage.set(QUIZ_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save quiz history:', error);
    }

    return result;
  },

  resetQuiz: () => {
    set({
      currentSession: null,
      isLoading: false,
      error: null,
    });
  },

  loadQuizHistory: () => {
    try {
      const historyJson = storage.getString(QUIZ_HISTORY_KEY);
      if (historyJson) {
        const history = JSON.parse(historyJson);
        set({ completedSessions: history });
      }
    } catch (error) {
      console.error('Failed to load quiz history:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  // Sync methods
  syncQuestions: async (principleIds: string[]) => {
    const state = get();
    if (state.isSyncing) return; // Prevent multiple syncs

    set({ isSyncing: true, syncError: null });

    try {
      const result = await SyncService.forceSync(principleIds);
      
      if (result.success) {
        set({
          isSyncing: false,
          lastSyncTime: new Date(),
          syncError: null
        });
        console.log(`✅ Manual sync completed: ${result.synced} new, ${result.cached} cached`);
      } else {
        throw new Error(result.error || 'Sync failed');
      }
    } catch (error) {
      set({
        isSyncing: false,
        syncError: error instanceof Error ? error.message : 'Sync failed'
      });
      console.error('❌ Manual sync failed:', error);
    }
  },

  initializeSync: async (principleIds: string[]) => {
    try {
      await SyncService.initialize(principleIds);
      
      // Update sync status from service
      const status = SyncService.getSyncStatus();
      set({ lastSyncTime: status.lastSync });
      
    } catch (error) {
      console.warn('Sync initialization failed:', error);
      set({ syncError: error instanceof Error ? error.message : 'Sync init failed' });
    }
  },

  getSyncStatus: () => {
    return SyncService.getSyncStatus();
  },

  clearSyncError: () => {
    set({ syncError: null });
  },
}));