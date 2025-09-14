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
    console.log('🔄 loadPrinciples called');
    console.log('📊 API config:', { 
      enabled: config.api.enabled, 
      baseUrl: config.api.baseUrl,
      timeout: config.api.timeout 
    });
    
    set({ isLoading: true, error: null });
    
    try {
      // Try to load from API first if enabled
      if (config.api.enabled) {
        console.log('🌐 Loading principles from API first...');
        await get().refreshPrinciples();
        return;
      }

      // If API is disabled, try to load from cache
      const cached = ContentCacheService.getCachedPrinciples();
      
      if (cached) {
        console.log('📦 Loading principles from cache (API disabled)');
        set({
          principles: cached.principles,
          categories: cached.categories,
          lastSynced: cached.lastSync,
          isLoading: false,
          isOffline: true
        });
        return;
      }

      // No cache and API disabled - this is an error state
      throw new Error('No cached data available and API is disabled');
      
    } catch (error) {
      console.error('Failed to load principles:', error);
      
      // Fallback to cache if API fails
      const cached = ContentCacheService.getCachedPrinciples();
      if (cached) {
        console.warn('⚠️ Using cached data after API failure');
        set({
          principles: cached.principles,
          categories: cached.categories,
          lastSynced: cached.lastSync,
          isLoading: false,
          error: 'API unavailable (using cached data)',
          isOffline: true
        });
      } else {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to load principles',
          isLoading: false,
          isOffline: true
        });
      }
    }
  },

  refreshPrinciples: async () => {
    try {
      console.log('🌐 Fetching principles from API...');
      console.log('📡 Making request to:', config.api.baseUrl + '/api/principles');
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