export const tokens = {
  colors: {
    brand: {
      primary: '#0EA5E9',
      secondary: '#64748B',
    },
    categories: {
      attention: '#EF4444',
      memory: '#8B5CF6', 
      decisions: '#10B981',
      usability: '#F59E0B',
    },
    gray: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  }
} as const;

export type PrincipleType = "ux_law" | "cognitive_bias" | "heuristic";

export interface Principle {
  id: string;
  type: PrincipleType;
  title: string;
  oneLiner: string;
  definition: string;
  appliesWhen: string[];
  do: string[];
  dont: string[];
  example?: {
    image: string;
    caption: string;
  };
  tags: string[];
  category: string;
  sources: string[];
}

export interface Category {
  id: string;
  label: string;
  description: string;
  color: string;
}