import { create } from 'zustand';
import { Principle } from '../data/types';
import { getTodaysPrinciple, shouldRefreshDaily } from '../lib/daily-rotation';
import { usePrinciples } from './usePrinciples';

interface DailyStore {
  todaysPrinciple: Principle | null;
  isLoading: boolean;
  lastRefresh: string | null;
  
  // Actions
  loadTodaysPrinciple: () => void;
  refreshDaily: () => void;
}

export const useDaily = create<DailyStore>((set, get) => ({
  todaysPrinciple: null,
  isLoading: false,
  lastRefresh: null,

  loadTodaysPrinciple: () => {
    set({ isLoading: true });
    
    try {
      const { principles } = usePrinciples.getState();
      
      if (principles.length === 0) {
        console.warn('No principles loaded yet');
        set({ isLoading: false });
        return;
      }
      
      const todaysPrinciple = getTodaysPrinciple(principles);
      const today = new Date().toISOString().split('T')[0];
      
      set({ 
        todaysPrinciple, 
        isLoading: false,
        lastRefresh: today
      });
    } catch (error) {
      console.error('Failed to load today\'s principle:', error);
      set({ isLoading: false });
    }
  },

  refreshDaily: () => {
    const { loadTodaysPrinciple } = get();
    
    if (shouldRefreshDaily()) {
      loadTodaysPrinciple();
    }
  },
}));