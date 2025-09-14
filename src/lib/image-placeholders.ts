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

// Emoji mappings by title (since API uses UUID IDs)
export const EMOJI_BY_TITLE = {
  "Fitts's Law": '🎯',
  "Hick's Law": '🤔', 
  "Miller's Rule": '🧠',
  "Jakob's Law": '🔄',
  "Pareto Principle": '📊',
  "Proximity Principle": '📦',
  "Serial Position Effect": '📋',
  "Zeigarnik Effect": '⚪',
  "Peak-End Rule": '📈',
  "Von Restorff Effect": '🌟',
  "Confirmation Bias": '🔍',
  "Anchoring Bias": '⚓',
  "Loss Aversion": '💸',
  "Choice Overload": '🤯',
  "Availability Heuristic": '💭',
  "Dunning-Kruger Effect": '🎓',
  "Sunk Cost Fallacy": '🕳️',
  "Recognition over Recall": '👁️',
  "Consistency and Standards": '📐',
  "Error Prevention": '🛡️',
  "Aesthetic-Usability Effect": '✨',
  "Cognitive Load Theory": '🧮'
} as const;

// Get placeholder for principle (backwards compatibility)
export function getPrincipleImage(principleId: string): string {
  return PRINCIPLE_IMAGES[principleId as keyof typeof PRINCIPLE_IMAGES] || '📚';
}

// Get emoji by principle title
export function getPrincipleEmoji(title: string): string {
  return EMOJI_BY_TITLE[title as keyof typeof EMOJI_BY_TITLE] || '📚';
}

// Category colors matching our design tokens
export const CATEGORY_COLORS = {
  attention: '#EF4444',
  memory: '#8B5CF6',
  decisions: '#10B981', 
  usability: '#F59E0B'
} as const;