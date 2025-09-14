import { create } from 'zustand';
import { Principle, Category } from '../data/types';
import { ApiService } from '../lib/api';
import { ContentCacheService } from '../lib/contentCache';
import { config } from '../lib/config';

interface PrinciplesStore {
  principles: Principle[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  lastSynced: Date | null;
  isOffline: boolean;
  
  // Actions
  loadPrinciples: () => Promise<void>;
  refreshPrinciples: () => Promise<void>;
  getPrincipleById: (id: string) => Principle | undefined;
  getPrinciplesByType: (type: Principle['type']) => Principle[];
  getPrinciplesByCategory: (category: string) => Principle[];
  getCacheStats: () => any;
}

export const usePrinciples = create<PrinciplesStore>((set, get) => ({
  principles: [],
  categories: [],
  isLoading: false,
  error: null,
  lastSynced: null,
  isOffline: false,

  loadPrinciples: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Try to load from cache first
      const cached = ContentCacheService.getCachedPrinciples();
      
      if (cached && ContentCacheService.isCacheValid()) {
        console.log('📦 Loading principles from cache');
        set({
          principles: cached.principles,
          categories: cached.categories,
          lastSynced: cached.lastSync,
          isLoading: false,
          isOffline: false
        });
        
        // Try to refresh in background if API is enabled
        if (config.api.enabled) {
          get().refreshPrinciples().catch(console.warn);
        }
        return;
      }

      // Load from API if cache is invalid or empty
      if (config.api.enabled) {
        await get().refreshPrinciples();
      } else {
        // Fallback: load from cache even if expired, or show error
        if (cached) {
          console.warn('⚠️ Using expired cache (API disabled)');
          set({
            principles: cached.principles,
            categories: cached.categories,
            lastSynced: cached.lastSync,
            isLoading: false,
            isOffline: true
          });
        } else {
          throw new Error('No cached data available and API is disabled');
        }
      }
      
    } catch (error) {
      console.error('Failed to load principles:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load principles',
        isLoading: false,
        isOffline: true
      });
    }
  },

  refreshPrinciples: async () => {
    try {
      console.log('🌐 Fetching principles from API...');
      const response = await ApiService.getPrinciples();
      
      if (response.success) {
        // Cache the new data
        ContentCacheService.cachePrinciples(
          response.data.principles,
          response.data.categories,
          response.data.meta.version
        );
        
        set({
          principles: response.data.principles,
          categories: response.data.categories,
          lastSynced: new Date(response.data.meta.lastSynced),
          isLoading: false,
          error: null,
          isOffline: false
        });
        
        console.log(`✅ Loaded ${response.data.principles.length} principles from API`);
      } else {
        throw new Error('API returned unsuccessful response');
      }
      
    } catch (error) {
      console.error('Failed to refresh principles:', error);
      
      // If refresh fails but we have cache, keep using it
      const cached = ContentCacheService.getCachedPrinciples();
      if (cached) {
        console.warn('⚠️ Using cached data after refresh failure');
        set({
          principles: cached.principles,
          categories: cached.categories,
          lastSynced: cached.lastSync,
          isLoading: false,
          error: 'Failed to refresh (using cached data)',
          isOffline: true
        });
      } else {
        set({
          error: error instanceof Error ? error.message : 'Failed to refresh principles',
          isLoading: false,
          isOffline: true
        });
      }
    }
  },

  getPrincipleById: (id: string) => {
    return get().principles.find(p => p.id === id);
  },

  getPrinciplesByType: (type: Principle['type']) => {
    return get().principles.filter(p => p.type === type);
  },

  getPrinciplesByCategory: (category: string) => {
    return get().principles.filter(p => p.category === category);
  },

  getCacheStats: () => {
    return ContentCacheService.getCacheStats();
  },
}));