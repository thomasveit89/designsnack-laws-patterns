// Placeholder image mappings for principles
// In production, these would be actual image files in assets/images/principles/

export const PRINCIPLE_IMAGES = {
  'fitts-law': '🎯',
  'hicks-law': '🤔', 
  'millers-rule': '🧠',
  'jakobs-law': '🔄',
  'pareto-principle': '📊',
  'proximity-principle': '📦',
  'serial-position-effect': '📋',
  'zeigarnik-effect': '⚪',
  'peak-end-rule': '📈',
  'von-restorff-effect': '🌟',
  'confirmation-bias': '🔍',
  'anchoring-bias': '⚓',
  'loss-aversion': '💸',
  'choice-overload': '🤯',
  'availability-heuristic': '💭',
  'dunning-kruger-effect': '🎓',
  'sunk-cost-fallacy': '🕳️',
  'recognition-over-recall': '👁️',
  'consistency-standards': '📐',
  'error-prevention': '🛡️'
} as const;

// Get placeholder for principle
export function getPrincipleImage(principleId: string): string {
  return PRINCIPLE_IMAGES[principleId as keyof typeof PRINCIPLE_IMAGES] || '📚';
}

// Category colors matching our design tokens
export const CATEGORY_COLORS = {
  attention: '#EF4444',
  memory: '#8B5CF6',
  decisions: '#10B981', 
  usability: '#F59E0B'
} as const;