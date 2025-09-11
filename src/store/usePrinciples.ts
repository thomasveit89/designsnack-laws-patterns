import { create } from 'zustand';
import { Principle, Category } from '../data/types';
import principlesData from '../data/principles.json';
import categoriesData from '../data/categories.json';

interface PrinciplesStore {
  principles: Principle[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadPrinciples: () => void;
  getPrincipleById: (id: string) => Principle | undefined;
  getPrinciplesByType: (type: Principle['type']) => Principle[];
  getPrinciplesByCategory: (category: string) => Principle[];
}

export const usePrinciples = create<PrinciplesStore>((set, get) => ({
  principles: [],
  categories: [],
  isLoading: false,
  error: null,

  loadPrinciples: () => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this might be an async API call
      const principles = principlesData as Principle[];
      const categories = categoriesData as Category[];
      
      set({ 
        principles, 
        categories, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to load principles', 
        isLoading: false 
      });
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
}));