import { Principle, QuizQuestion } from '../data/types';
import { config } from './config';

// API Endpoints
const ENDPOINTS = {
  health: '/api/health',
  principles: '/api/principles',
  questions: '/api/quiz/questions',
  sync: '/api/quiz/sync',
  generate: '/api/quiz/generate'
} as const;

// Request/Response Types
export interface GetQuestionsRequest {
  principleIds: string[];
  limit?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  excludeIds?: string[];
}

export interface GetQuestionsResponse {
  questions: QuizQuestion[];
  totalAvailable: number;
  success: boolean;
  message: string;
}

export interface GetPrinciplesResponse {
  success: boolean;
  data: {
    principles: (Principle & { questionCount: number; lastUpdated: string })[];
    categories: {
      id: string;
      name: string;
      description: string;
      icon: string;
    }[];
    meta: {
      totalPrinciples: number;
      totalCategories: number;
      lastSynced: string;
      version: string;
    };
  };
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
  details?: string;
}

// API Service Class
export class ApiService {
  private static baseUrl = config.api.baseUrl;

  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const requestConfig: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: config.api.timeout,
      ...options,
    };

    try {
      const response = await fetch(url, requestConfig);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          code: 'HTTP_ERROR'
        }));
        throw new Error(errorData.error || `API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest(ENDPOINTS.health);
  }

  // Get principles and categories
  static async getPrinciples(): Promise<GetPrinciplesResponse> {
    return this.makeRequest(ENDPOINTS.principles);
  }

  // Get quiz questions
  static async getQuestions(request: GetQuestionsRequest): Promise<GetQuestionsResponse> {
    return this.makeRequest(ENDPOINTS.questions, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Sync questions (for offline caching)
  static async syncQuestions(principleIds: string[]): Promise<{
    questions: QuizQuestion[];
    totalSynced: number;
    success: boolean;
  }> {
    return this.makeRequest(ENDPOINTS.sync, {
      method: 'POST',
      body: JSON.stringify({ principleIds }),
    });
  }

  // Generate new questions (admin/development use)
  static async generateQuestions(request: {
    principleIds: string[];
    questionsPerPrinciple?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }): Promise<{
    questions: QuizQuestion[];
    generated: number;
    success: boolean;
  }> {
    return this.makeRequest(ENDPOINTS.generate, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}