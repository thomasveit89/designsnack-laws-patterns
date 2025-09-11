import { Principle } from '../data/types';
import { dailyStorage, favoritesStorage, genericStorage } from './storage';

// Simple hash function for deterministic seeding
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Simple seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

// Get unique device/installation identifier
function getDeviceId(): string {
  // For now, we'll create a simple device ID
  // In a real app, you might use expo-application Constants.deviceId or similar
  let deviceId = genericStorage.get('device-id');
  if (!deviceId) {
    deviceId = Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    genericStorage.set('device-id', deviceId);
  }
  return deviceId;
}

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get today's principle using deterministic algorithm
export function getTodaysPrinciple(principles: Principle[]): Principle {
  const today = formatDate(new Date());
  const deviceId = getDeviceId();
  
  // Check if we already selected today's principle
  const dailyHistory = dailyStorage.getDailyHistory();
  const existingPrincipleId = dailyHistory[today];
  
  if (existingPrincipleId) {
    const existing = principles.find(p => p.id === existingPrincipleId);
    if (existing) {
      return existing;
    }
  }
  
  // Generate new selection for today
  const seed = hashString(today + deviceId);
  const rng = new SeededRandom(seed);
  
  // Get recently shown principles to avoid repeats
  const recentIds = dailyStorage.getRecentIds(7);
  const available = principles.filter(p => !recentIds.includes(p.id));
  
  // If we've exhausted non-recent options, use all principles
  const selectionPool = available.length > 0 ? available : principles;
  
  // Weight favorites 1.5x (add them twice to increase probability)
  const favorites = favoritesStorage.getList();
  const weightedPool: Principle[] = [];
  
  selectionPool.forEach(principle => {
    weightedPool.push(principle);
    if (favorites.includes(principle.id)) {
      weightedPool.push(principle); // Add favorites twice for 2x weight
    }
  });
  
  // Select random principle from weighted pool
  const randomIndex = Math.floor(rng.next() * weightedPool.length);
  const selected = weightedPool[randomIndex];
  
  // Store selection in history and recent list
  const updatedHistory = { ...dailyHistory, [today]: selected.id };
  dailyStorage.setDailyHistory(updatedHistory);
  dailyStorage.addRecentId(selected.id);
  
  return selected;
}

// Check if we need to refresh today's principle (for testing)
export function shouldRefreshDaily(): boolean {
  const today = formatDate(new Date());
  const storedTodayKey = dailyStorage.getTodayKey();
  
  if (storedTodayKey !== today) {
    dailyStorage.setTodayKey(today);
    return true;
  }
  
  return false;
}

// Get tomorrow's principle (for preview/testing)
export function getTomorrowsPrinciple(principles: Principle[]): Principle {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = formatDate(tomorrow);
  const deviceId = getDeviceId();
  
  const seed = hashString(tomorrowDate + deviceId);
  const rng = new SeededRandom(seed);
  
  // Use same algorithm as today but with tomorrow's date
  const recentIds = dailyStorage.getRecentIds(7);
  const available = principles.filter(p => !recentIds.includes(p.id));
  const selectionPool = available.length > 0 ? available : principles;
  
  const favorites = favoritesStorage.getList();
  const weightedPool: Principle[] = [];
  
  selectionPool.forEach(principle => {
    weightedPool.push(principle);
    if (favorites.includes(principle.id)) {
      weightedPool.push(principle);
    }
  });
  
  const randomIndex = Math.floor(rng.next() * weightedPool.length);
  return weightedPool[randomIndex];
}

// Reset daily rotation (for testing/debugging)
export function resetDailyRotation() {
  dailyStorage.setDailyHistory({});
  dailyStorage.addRecentId('', 0); // Clear recent list
}