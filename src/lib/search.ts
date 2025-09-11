import { Principle, PrincipleType } from '../data/types';

// Simple search function for principles
export function searchPrinciples(
  principles: Principle[], 
  query: string,
  filters?: {
    type?: PrincipleType;
    category?: string;
    tags?: string[];
  }
): Principle[] {
  if (!query && !filters) return principles;
  
  let filtered = principles;
  
  // Apply type filter
  if (filters?.type) {
    filtered = filtered.filter(p => p.type === filters.type);
  }
  
  // Apply category filter  
  if (filters?.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }
  
  // Apply tag filters
  if (filters?.tags && filters.tags.length > 0) {
    filtered = filtered.filter(p => 
      filters.tags!.some(tag => p.tags.includes(tag))
    );
  }
  
  // Apply text search if query provided
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase().trim();
    
    filtered = filtered.filter(principle => {
      const searchableText = [
        principle.title,
        principle.oneLiner,
        principle.definition,
        ...principle.tags,
        ...principle.appliesWhen
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchTerm);
    });
  }
  
  return filtered;
}

// Get unique tags from all principles
export function getUniqueTags(principles: Principle[]): string[] {
  const tagSet = new Set<string>();
  principles.forEach(principle => {
    principle.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

// Get principles by type
export function getPrinciplesByType(principles: Principle[], type: PrincipleType): Principle[] {
  return principles.filter(p => p.type === type);
}

// Get principles by category
export function getPrinciplesByCategory(principles: Principle[], category: string): Principle[] {
  return principles.filter(p => p.category === category);
}

// Get related principles based on tags
export function getRelatedPrinciples(
  principles: Principle[], 
  currentPrinciple: Principle, 
  limit: number = 3
): Principle[] {
  const related = principles
    .filter(p => p.id !== currentPrinciple.id) // Exclude current principle
    .map(p => ({
      principle: p,
      score: calculateSimilarityScore(currentPrinciple, p)
    }))
    .filter(item => item.score > 0) // Only include if there's some similarity
    .sort((a, b) => b.score - a.score) // Sort by highest similarity
    .slice(0, limit)
    .map(item => item.principle);
    
  return related;
}

// Calculate similarity score between two principles
function calculateSimilarityScore(p1: Principle, p2: Principle): number {
  let score = 0;
  
  // Same category gets high score
  if (p1.category === p2.category) score += 3;
  
  // Same type gets medium score
  if (p1.type === p2.type) score += 2;
  
  // Shared tags get points
  const sharedTags = p1.tags.filter(tag => p2.tags.includes(tag));
  score += sharedTags.length;
  
  // Shared "applies when" contexts
  const sharedContexts = p1.appliesWhen.filter(context => 
    p2.appliesWhen.includes(context)
  );
  score += sharedContexts.length * 0.5;
  
  return score;
}

// Popular tags (most commonly used)
export function getPopularTags(principles: Principle[], limit: number = 10): string[] {
  const tagCounts = new Map<string, number>();
  
  principles.forEach(principle => {
    principle.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}