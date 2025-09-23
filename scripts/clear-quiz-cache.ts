#!/usr/bin/env npx tsx

/**
 * Clear Quiz Cache Script
 * This script clears cached quiz questions to force regeneration with latest logic
 */

import { QuestionCacheService } from '../src/lib/questionCache';

console.log('🗑️ Clearing quiz question cache...');

try {
  // Clear the question cache
  QuestionCacheService.clearCache();

  console.log('✅ Quiz cache cleared successfully!');
  console.log('');
  console.log('📝 Next quiz will use fresh questions with correct answer randomization.');
  console.log('🎯 The correct answers will no longer always be "A"!');

} catch (error) {
  console.error('❌ Error clearing cache:', error);
  process.exit(1);
}