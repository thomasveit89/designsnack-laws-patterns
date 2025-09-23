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
  // Original principles
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
  "Cognitive Load Theory": '🧮',

  // New attention principles
  "Attentional Bias": '👀',
  "Visual Anchors": '⚓',
  "Visual Hierarchy": '📊',
  "Selective Attention": '🎯',
  "Contrast Principle": '⚡',
  "Signifiers: Visual or Textual Cues": '🚩',
  "Signifiers": '🚩',
  "Juxtaposition": '🔗',
  "Spotlight Effect": '💡',
  "Cheerleader Effect": '👥',
  "Curiosity Gap": '🕳️',
  "Barnum-Forer Effect": '🔮',
  "Aha! Moment": '💡',

  // New decision principles
  "Decoy Effect": '🎭',
  "Centre-Stage Effect": '🎪',
  "Framing Principle": '🖼️',
  "Authority Bias": '👑',
  "Affect Heuristic": '❤️',
  "Cashless Effect": '💳',
  "Backfire Effect": '🔙',
  "Cognitive Dissonance": '🤔',
  "Commitment and Consistency Principle": '🤝',
  "Decision Fatigue": '😴',
  "Reactance Principle": '🛑',
  "Hyperbolic Discounting": '📉',
  "Self-serving Bias": '🪞',
  "Fresh Start Effect": '🌱',
  "Default Bias": '⭐',
  "Expectations Bias": '🔮',
  "Survivorship Bias": '🏆',
  "Empathy Gap": '💭',
  "Hindsight Bias": '👁️',
  "Temptation Coupling": '🍯',
  "Noble Edge Effect": '🌍',
  "Observer-Expectancy Effect": '🔬',
  "False Consensus Effect": '👫',
  "Negativity Bias": '⚠️',
  "Social Proof": '👥',
  "Scarcity Principle": '⏰',
  "Principle of Reciprocity": '🤝',
  "Social Desirability Bias": '😊',
  "Variable Reward Principle": '🎰',
  "Pseudo-Set Framing": '📦',

  // New memory principles
  "Chunking": '📦',
  "Picture Superiority Effect": '🖼️',
  "Method of Loci": '🗺️',
  "Spacing Effect": '📅',
  "Storytelling Effect": '📚',

  // New usability principles
  "Tesler's Law": '⚖️',
  "Progressive Disclosure": '📖',
  "Nudging Principle": '👉',
  "Feedback Loop Principle": '🔄',
  "Flow State": '🌊',
  "Skeuomorphism": '📱',
  "Spark Effect": '⚡',
  "Provide Exit Points": '🚪',
  "Sensory Appeal": '✨',
  "Endowment Effect": '💎',
  "Delighters Principle": '🎉',
  "Internal Trigger": '🔔',
  "External Trigger": '📢',
  "Self-Initiated Triggers Principle": '⏰',
  "Shaping: Gradually Guiding User Behavior": '🎨',
  "Shaping": '🎨',
  "Consistency & Standards": '📏',
  "Cognitive Load": '🧠',
  "Curse of Knowledge": '🎓',
  "Discoverability": '🔍',
  "Mental Model Principle": '🧠',
  "Familiarity Bias": '🏠',
  "Halo Effect": '😇',
  "Unit Bias": '1️⃣',
  "Labor Illusion": '🔨',
  "Investment Loops": '💰',
  "Weber's Law": '📊',
  "Law of the Instrument": '🔨',
  "IKEA Effect": '🛠️',
  "Planning Fallacy": '📅',
  "Goal Gradient Effect": '🏁',
  "Feedforward": '📡',
  "Occam's Razor": '🗡️',
  "Law of Similarity": '🔗',
  "Law of Prägnanz": '🎯',
  "Law of Proximity": '📍',
  "Priming": '🎭',
  "Sensory Adaptation": '👂'
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
  usability: '#F59E0B',
  persuasion: '#EC4899',
  visual: '#6366F1'
} as const;