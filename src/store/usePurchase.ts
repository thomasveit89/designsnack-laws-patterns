import { create } from 'zustand';
import { storage } from '../lib/storage';
import { Platform } from 'react-native';

// Gracefully handle missing native module in Expo Go
let InAppPurchases: any;
try {
  InAppPurchases = require('expo-in-app-purchases');
} catch (e) {
  console.warn('expo-in-app-purchases not available - running in development mode');
  InAppPurchases = null;
}

const PREMIUM_SKU = Platform.select({
  ios: 'com.designsnack.lawspatterns.premium',
  android: 'com.designsnack.lawspatterns.premium',
}) as string;

const PURCHASE_KEY = 'premium_purchased';
const DEV_MODE_KEY = 'dev_mode_premium'; // For testing in development

interface PurchaseStore {
  isPremium: boolean;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  purchasePremium: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  checkPurchaseStatus: () => boolean;
}

export const usePurchase = create<PurchaseStore>((set, get) => ({
  isPremium: false,
  isLoading: false,
  isConnected: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });

      // Check local storage first
      const localPurchase = storage.getBoolean(PURCHASE_KEY);
      if (localPurchase) {
        set({ isPremium: true, isLoading: false });
        return;
      }

      // Development mode: check dev flag
      const devModePremium = storage.getBoolean(DEV_MODE_KEY);
      if (devModePremium) {
        console.log('🔓 Dev mode: Premium unlocked');
        set({ isPremium: true, isLoading: false });
        return;
      }

      // If IAP module not available (Expo Go), just finish loading
      if (!InAppPurchases) {
        console.log('📱 Running in Expo Go - IAP not available');
        set({ isLoading: false });
        return;
      }

      // Connect to store
      await InAppPurchases.connectAsync();
      set({ isConnected: true });

      // Get available products
      const { responseCode, results } = await InAppPurchases.getProductsAsync([PREMIUM_SKU]);

      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        console.log('Premium product available:', results);
      }

      // Check purchase history
      const history = await InAppPurchases.getPurchaseHistoryAsync();
      const hasPurchased = history.results?.some(
        purchase => purchase.productId === PREMIUM_SKU &&
                   (purchase as any).purchaseState === InAppPurchases.InAppPurchaseState.PURCHASED
      );

      if (hasPurchased) {
        storage.set(PURCHASE_KEY, true);
        set({ isPremium: true });
      }

      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to initialize purchases:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize purchases',
        isLoading: false
      });
    }
  },

  purchasePremium: async () => {
    try {
      set({ isLoading: true, error: null });

      // Development mode: simulate purchase
      if (!InAppPurchases) {
        console.log('🔓 Dev mode: Simulating purchase...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        storage.set(DEV_MODE_KEY, true);
        set({ isPremium: true, isLoading: false });
        return true;
      }

      if (!get().isConnected) {
        await get().initialize();
      }

      const { responseCode, results, errorCode } = await InAppPurchases.purchaseItemAsync(PREMIUM_SKU);

      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        storage.set(PURCHASE_KEY, true);
        set({ isPremium: true, isLoading: false });
        console.log('Purchase successful!', results);
        return true;
      } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
        set({ isLoading: false });
        return false;
      } else {
        throw new Error(`Purchase failed with code: ${errorCode}`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      set({
        error: error instanceof Error ? error.message : 'Purchase failed',
        isLoading: false
      });
      return false;
    }
  },

  restorePurchases: async () => {
    try {
      set({ isLoading: true, error: null });

      // Development mode: check if already purchased
      if (!InAppPurchases) {
        const devModePremium = storage.getBoolean(DEV_MODE_KEY);
        if (devModePremium) {
          set({ isPremium: true, isLoading: false });
          return true;
        } else {
          set({ isLoading: false, error: 'No previous purchases found (dev mode)' });
          return false;
        }
      }

      if (!get().isConnected) {
        await get().initialize();
      }

      const history = await InAppPurchases.getPurchaseHistoryAsync();
      const hasPurchased = history.results?.some(
        purchase => purchase.productId === PREMIUM_SKU &&
                   (purchase as any).purchaseState === InAppPurchases.InAppPurchaseState.PURCHASED
      );

      if (hasPurchased) {
        storage.set(PURCHASE_KEY, true);
        set({ isPremium: true, isLoading: false });
        return true;
      } else {
        set({ isLoading: false, error: 'No previous purchases found' });
        return false;
      }
    } catch (error) {
      console.error('Restore error:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to restore purchases',
        isLoading: false
      });
      return false;
    }
  },

  checkPurchaseStatus: () => {
    return get().isPremium || storage.getBoolean(PURCHASE_KEY) || false;
  },
}));

// Helper function to check if a principle is locked
export function isPrincipleLocked(principleIndex: number, isPremium: boolean): boolean {
  const FREE_PRINCIPLES_COUNT = 30;
  return principleIndex >= FREE_PRINCIPLES_COUNT && !isPremium;
}
