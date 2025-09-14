import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage interface that works with both MMKV and AsyncStorage
interface StorageInterface {
  getString(key: string): string | null;
  set(key: string, value: string): void;
  delete(key: string): void;
  clearAll(): void;
}

// AsyncStorage wrapper to match MMKV interface
class AsyncStorageWrapper implements StorageInterface {
  private cache = new Map<string, string>();

  getString(key: string): string | null {
    // Return from cache if available (synchronous)
    if (this.cache.has(key)) {
      return this.cache.get(key) || null;
    }
    
    // Load asynchronously and cache for next time
    AsyncStorage.getItem(key).then(value => {
      if (value) {
        this.cache.set(key, value);
      }
    }).catch(() => {});
    
    return null;
  }

  set(key: string, value: string): void {
    this.cache.set(key, value);
    AsyncStorage.setItem(key, value).catch(() => {});
  }

  delete(key: string): void {
    this.cache.delete(key);
    AsyncStorage.removeItem(key).catch(() => {});
  }

  clearAll(): void {
    this.cache.clear();
    AsyncStorage.clear().catch(() => {});
  }

  // Initialize cache from AsyncStorage
  async initialize(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      items.forEach(([key, value]) => {
        if (value) {
          this.cache.set(key, value);
        }
      });
    } catch (error) {
      console.warn('Failed to initialize storage cache:', error);
    }
  }
}

// Use AsyncStorage for Expo Go compatibility
const storage = new AsyncStorageWrapper();

// Initialize storage cache
storage.initialize();

// Storage keys
export const STORAGE_KEYS = {
  FAVORITES: 'favorites',
  RECENT_DAILY: 'recent-daily', 
  QUIZ_PROGRESS: 'quiz-progress',
  SETTINGS: 'settings',
  LAST_READ: 'last-read',
  DAILY_HISTORY: 'daily-history',
  TODAY_KEY: 'today-key'
} as const;

// Favorites management
export const favoritesStorage = {
  get: (): Set<string> => {
    const favorites = storage.getString(STORAGE_KEYS.FAVORITES);
    return favorites ? new Set(JSON.parse(favorites)) : new Set();
  },
  
  set: (favorites: Set<string>) => {
    storage.set(STORAGE_KEYS.FAVORITES, JSON.stringify([...favorites]));
  },
  
  add: (principleId: string) => {
    const favorites = favoritesStorage.get();
    favorites.add(principleId);
    favoritesStorage.set(favorites);
  },
  
  remove: (principleId: string) => {
    const favorites = favoritesStorage.get();
    favorites.delete(principleId);
    favoritesStorage.set(favorites);
  },
  
  toggle: (principleId: string): boolean => {
    const favorites = favoritesStorage.get();
    if (favorites.has(principleId)) {
      favorites.delete(principleId);
      favoritesStorage.set(favorites);
      return false;
    } else {
      favorites.add(principleId);
      favoritesStorage.set(favorites);
      return true;
    }
  },
  
  has: (principleId: string): boolean => {
    return favoritesStorage.get().has(principleId);
  },
  
  getList: (): string[] => {
    return [...favoritesStorage.get()];
  },
  
  clear: () => {
    favoritesStorage.set(new Set());
  }
};

// Daily rotation management
export const dailyStorage = {
  getRecentIds: (count: number = 7): string[] => {
    const recent = storage.getString(STORAGE_KEYS.RECENT_DAILY);
    return recent ? JSON.parse(recent) : [];
  },
  
  addRecentId: (principleId: string, maxCount: number = 7) => {
    const recent = dailyStorage.getRecentIds();
    const filtered = recent.filter(id => id !== principleId);
    filtered.unshift(principleId);
    const trimmed = filtered.slice(0, maxCount);
    storage.set(STORAGE_KEYS.RECENT_DAILY, JSON.stringify(trimmed));
  },
  
  getTodayKey: (): string | null => {
    return storage.getString(STORAGE_KEYS.TODAY_KEY) || null;
  },
  
  setTodayKey: (key: string) => {
    storage.set(STORAGE_KEYS.TODAY_KEY, key);
  },
  
  getDailyHistory: (): Record<string, string> => {
    const history = storage.getString(STORAGE_KEYS.DAILY_HISTORY);
    return history ? JSON.parse(history) : {};
  },
  
  setDailyHistory: (history: Record<string, string>) => {
    storage.set(STORAGE_KEYS.DAILY_HISTORY, JSON.stringify(history));
  }
};

// Quiz progress management
export const quizStorage = {
  get: () => {
    const progress = storage.getString(STORAGE_KEYS.QUIZ_PROGRESS);
    return progress ? JSON.parse(progress) : { known: [], needReview: [] };
  },
  
  set: (progress: { known: string[], needReview: string[] }) => {
    storage.set(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(progress));
  },
  
  markAsKnown: (principleId: string) => {
    const progress = quizStorage.get();
    progress.known = [...new Set([...progress.known, principleId])];
    progress.needReview = progress.needReview.filter(id => id !== principleId);
    quizStorage.set(progress);
  },
  
  markNeedsReview: (principleId: string) => {
    const progress = quizStorage.get();
    progress.needReview = [...new Set([...progress.needReview, principleId])];
    progress.known = progress.known.filter(id => id !== principleId);
    quizStorage.set(progress);
  },
  
  reset: () => {
    quizStorage.set({ known: [], needReview: [] });
  }
};

// Settings management
export const settingsStorage = {
  get: () => {
    const settings = storage.getString(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {
      theme: 'system' as 'system' | 'light' | 'dark',
      hapticFeedback: true,
      notifications: false
    };
  },
  
  set: (settings: any) => {
    storage.set(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
  
  updateSetting: (key: string, value: any) => {
    const settings = settingsStorage.get();
    settings[key] = value;
    settingsStorage.set(settings);
  }
};

// Last read principle
export const lastReadStorage = {
  get: (): string | null => {
    return storage.getString(STORAGE_KEYS.LAST_READ) || null;
  },
  
  set: (principleId: string) => {
    storage.set(STORAGE_KEYS.LAST_READ, principleId);
  }
};

// Generic storage utilities
export const genericStorage = {
  get: (key: string): string | null => {
    return storage.getString(key) || null;
  },
  
  set: (key: string, value: string) => {
    storage.set(key, value);
  },
  
  getObject: <T>(key: string): T | null => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : null;
  },
  
  setObject: (key: string, value: any) => {
    storage.set(key, JSON.stringify(value));
  },
  
  remove: (key: string) => {
    storage.delete(key);
  },
  
  clear: () => {
    storage.clearAll();
  }
};

// Export the main storage instance
export { storage };