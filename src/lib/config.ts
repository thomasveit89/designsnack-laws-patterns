// App configuration for different environments

export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  cache: {
    maxAge: number; // milliseconds
    minQuestions: number;
    maxQuestions: number;
  };
  quiz: {
    defaultQuestionCount: number;
    defaultDifficulty: 'easy' | 'medium' | 'hard';
  };
  sync: {
    enabled: boolean;
    intervalHours: number;
    backgroundSync: boolean;
  };
}

// Development configuration
const developmentConfig: AppConfig = {
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 10000, // 10 seconds
  },
  cache: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours for development
    minQuestions: 20,
    maxQuestions: 100,
  },
  quiz: {
    defaultQuestionCount: 10,
    defaultDifficulty: 'medium',
  },
  sync: {
    enabled: true,
    intervalHours: 6,
    backgroundSync: true,
  },
};

// Production configuration
const productionConfig: AppConfig = {
  api: {
    baseUrl: 'https://designsnack-laws-patterns-backend.vercel.app',
    timeout: 15000, // 15 seconds
  },
  cache: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    minQuestions: 50,
    maxQuestions: 200,
  },
  quiz: {
    defaultQuestionCount: 10,
    defaultDifficulty: 'medium',
  },
  sync: {
    enabled: true,
    intervalHours: 24,
    backgroundSync: true,
  },
};

// Get current configuration based on environment
export const getConfig = (): AppConfig => {
  return __DEV__ ? developmentConfig : productionConfig;
};

// Export current config
export const config = getConfig();