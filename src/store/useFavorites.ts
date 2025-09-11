import { create } from 'zustand';
import { favoritesStorage } from '../lib/storage';
import * as Haptics from 'expo-haptics';

interface FavoritesStore {
  favorites: Set<string>;
  isLoading: boolean;
  
  // Actions
  loadFavorites: () => void;
  toggleFavorite: (principleId: string) => boolean;
  isFavorite: (principleId: string) => boolean;
  getFavoriteIds: () => string[];
  getFavoriteCount: () => number;
}

export const useFavorites = create<FavoritesStore>((set, get) => ({
  favorites: new Set(),
  isLoading: false,

  loadFavorites: () => {
    set({ isLoading: true });
    try {
      const favorites = favoritesStorage.get();
      set({ favorites, isLoading: false });
    } catch (error) {
      console.error('Failed to load favorites:', error);
      set({ isLoading: false });
    }
  },

  toggleFavorite: (principleId: string) => {
    const { favorites } = get();
    const newFavorites = new Set(favorites);
    
    let isFavorited: boolean;
    
    if (newFavorites.has(principleId)) {
      newFavorites.delete(principleId);
      isFavorited = false;
    } else {
      newFavorites.add(principleId);
      isFavorited = true;
    }
    
    // Update state
    set({ favorites: newFavorites });
    
    // Persist to storage
    favoritesStorage.set(newFavorites);
    
    // Haptic feedback
    Haptics.impactAsync(
      isFavorited 
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light
    );
    
    return isFavorited;
  },

  isFavorite: (principleId: string) => {
    return get().favorites.has(principleId);
  },

  getFavoriteIds: () => {
    return Array.from(get().favorites);
  },

  getFavoriteCount: () => {
    return get().favorites.size;
  },
}));