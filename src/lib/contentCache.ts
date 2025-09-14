import { storage } from './storage';
import { Principle } from '../data/types';

// Content caching service for principles and categories
export class ContentCacheService {
  private static readonly PRINCIPLES_CACHE_KEY = 'cached_principles';
  private static readonly CATEGORIES_CACHE_KEY = 'cached_categories';
  private static readonly CONTENT_VERSION_KEY = 'content_version';
  private static readonly LAST_CONTENT_SYNC_KEY = 'last_content_sync';
  private static readonly CACHE_EXPIRY_HOURS = 24; // Cache expires after 24 hours

  // Cache principles data
  static cachePrinciples(
    principles: Principle[], 
    categories: any[], 
    version: string
  ): void {
    try {
      if (!storage) {
        console.warn('Storage not available, cannot cache principles');
        return;
      }

      storage.set(this.PRINCIPLES_CACHE_KEY, JSON.stringify(principles));
      storage.set(this.CATEGORIES_CACHE_KEY, JSON.stringify(categories));
      storage.set(this.CONTENT_VERSION_KEY, version);
      storage.set(this.LAST_CONTENT_SYNC_KEY, Date.now().toString());

      console.log(`💾 Cached ${principles.length} principles and ${categories.length} categories (v${version})`);
    } catch (error) {
      console.error('Failed to cache principles:', error);
    }
  }

  // Get cached principles
  static getCachedPrinciples(): {
    principles: Principle[];
    categories: any[];
    version: string | null;
    lastSync: Date | null;
  } | null {
    try {
      if (!storage) {
        console.warn('Storage not available');
        return null;
      }

      const principlesStr = storage.getString(this.PRINCIPLES_CACHE_KEY);
      const categoriesStr = storage.getString(this.CATEGORIES_CACHE_KEY);
      const version = storage.getString(this.CONTENT_VERSION_KEY);
      const lastSyncStr = storage.getString(this.LAST_CONTENT_SYNC_KEY);

      if (!principlesStr || !categoriesStr) {
        return null;
      }

      const principles = JSON.parse(principlesStr);
      const categories = JSON.parse(categoriesStr);
      const lastSync = lastSyncStr ? new Date(parseInt(lastSyncStr)) : null;

      return {
        principles,
        categories,
        version,
        lastSync
      };
    } catch (error) {
      console.error('Failed to get cached principles:', error);
      return null;
    }
  }

  // Check if cache is valid
  static isCacheValid(): boolean {
    try {
      if (!storage) {
        return false;
      }

      const lastSyncStr = storage.getString(this.LAST_CONTENT_SYNC_KEY);
      if (!lastSyncStr) {
        return false;
      }

      const lastSync = parseInt(lastSyncStr);
      const now = Date.now();
      const hoursSinceLastSync = (now - lastSync) / (1000 * 60 * 60);

      const isValid = hoursSinceLastSync < this.CACHE_EXPIRY_HOURS;
      
      if (!isValid) {
        console.log(`📅 Content cache expired (${hoursSinceLastSync.toFixed(1)}h old)`);
      }

      return isValid;
    } catch (error) {
      console.error('Failed to check cache validity:', error);
      return false;
    }
  }

  // Get cache stats
  static getCacheStats(): {
    isValid: boolean;
    principleCount: number;
    categoryCount: number;
    lastSync: Date | null;
    version: string | null;
  } {
    const cached = this.getCachedPrinciples();
    
    return {
      isValid: this.isCacheValid(),
      principleCount: cached?.principles.length || 0,
      categoryCount: cached?.categories.length || 0,
      lastSync: cached?.lastSync || null,
      version: cached?.version || null
    };
  }

  // Clear cache
  static clearCache(): void {
    try {
      if (!storage) {
        console.warn('Storage not available');
        return;
      }

      storage.delete(this.PRINCIPLES_CACHE_KEY);
      storage.delete(this.CATEGORIES_CACHE_KEY);
      storage.delete(this.CONTENT_VERSION_KEY);
      storage.delete(this.LAST_CONTENT_SYNC_KEY);

      console.log('🗑️ Content cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // Force cache refresh
  static shouldRefreshCache(): boolean {
    return !this.isCacheValid() || !this.getCachedPrinciples();
  }
}