import { ApiService } from './api';
import { QuestionCacheService } from './questionCache';
import { ContentCacheService } from './contentCache';
import { config } from './config';
import { storage } from './storage';

// Sync service for managing question synchronization
export class SyncService {
  private static readonly SYNC_STATUS_KEY = 'sync_status';
  private static readonly LAST_BACKGROUND_SYNC_KEY = 'last_background_sync';

  // Check if sync is needed
  static shouldSync(): boolean {
    if (!config.sync.enabled) return false;

    const lastSyncStr = storage.getString(this.LAST_BACKGROUND_SYNC_KEY);
    if (!lastSyncStr) return true;

    const lastSync = parseInt(lastSyncStr);
    const now = Date.now();
    const hoursSinceLastSync = (now - lastSync) / (1000 * 60 * 60);

    return hoursSinceLastSync >= config.sync.intervalHours;
  }

  // Perform sync with backend
  static async syncQuestions(principleIds: string[]): Promise<{
    success: boolean;
    synced: number;
    error?: string;
  }> {
    console.log('🔄 Starting question sync...');
    
    try {
      // Check if we can reach the API
      await ApiService.healthCheck();
      
      // Sync questions for given principles
      const response = await ApiService.syncQuestions(principleIds);
      
      if (response.success && response.questions.length > 0) {
        // Update cache with synced questions
        QuestionCacheService.updateCache(response.questions, principleIds);
        
        // Update sync timestamp
        storage.set(this.LAST_BACKGROUND_SYNC_KEY, Date.now().toString());
        
        console.log(`✅ Synced ${response.totalSynced} questions`);
        
        return {
          success: true,
          synced: response.totalSynced
        };
      } else {
        throw new Error('No questions received from sync');
      }
      
    } catch (error) {
      console.error('❌ Sync failed:', error);
      return {
        success: false,
        synced: 0,
        error: error instanceof Error ? error.message : 'Unknown sync error'
      };
    }
  }

  // Perform background sync (non-blocking)
  static async backgroundSync(principleIds: string[]): Promise<void> {
    if (!config.sync.backgroundSync || !this.shouldSync()) {
      return;
    }

    // Run sync in background without blocking UI
    this.syncQuestions(principleIds).catch(error => {
      console.warn('Background sync failed (this is OK):', error);
    });
  }

  // Force sync (for manual refresh)
  static async forceSync(principleIds: string[]): Promise<{
    success: boolean;
    synced: number;
    cached: number;
    error?: string;
  }> {
    const syncResult = await this.syncQuestions(principleIds);
    const cacheStats = QuestionCacheService.getCacheStats();
    
    return {
      ...syncResult,
      cached: cacheStats.totalQuestions
    };
  }

  // Get sync status
  static getSyncStatus(): {
    lastSync: Date | null;
    needsSync: boolean;
    cacheValid: boolean;
    totalCached: number;
  } {
    const lastSyncStr = storage.getString(this.LAST_BACKGROUND_SYNC_KEY);
    const lastSync = lastSyncStr ? new Date(parseInt(lastSyncStr)) : null;
    const cacheStats = QuestionCacheService.getCacheStats();
    
    return {
      lastSync,
      needsSync: this.shouldSync(),
      cacheValid: cacheStats.isValid,
      totalCached: cacheStats.totalQuestions
    };
  }

  // Initialize sync service (call on app start)
  static async initialize(principleIds: string[]): Promise<void> {
    console.log('🚀 Initializing sync service...');
    
    try {
      // Check if storage is ready before doing cache checks
      try {
        // Check if content cache needs refresh
        const contentCacheValid = ContentCacheService.isCacheValid();
        if (!contentCacheValid) {
          console.log('📦 Content cache invalid or missing');
          // Content will be loaded by the principles store
        }
        
        // Check if question cache needs refresh
        const questionCacheValid = QuestionCacheService.isCacheValid();
        if (!questionCacheValid) {
          console.log('📦 Question cache invalid, attempting initial sync...');
          // Don't await this - let it run in background
          this.backgroundSync(principleIds).catch(error => {
            console.warn('Background sync failed during init:', error);
          });
        }
      } catch (storageError) {
        console.warn('Storage check failed, continuing without sync:', storageError);
      }
      
      console.log('✅ Sync service initialized');
    } catch (error) {
      console.warn('⚠️ Sync service initialization failed:', error);
    }
  }
}