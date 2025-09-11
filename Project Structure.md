# DESIGNSNACK Laws & Patterns - Project Structure

## Complete File Structure
```
designsnack-laws-patterns/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root tab navigation
│   ├── index.tsx                # Home screen (Today's Law)
│   ├── library.tsx              # Browse all principles  
│   ├── quiz.tsx                 # Flashcard practice
│   └── principle/
│       └── [id].tsx             # Dynamic principle detail
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Core design system
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── ListItem.tsx
│   │   │   └── index.ts         # Barrel exports
│   │   ├── home/                # Home-specific components
│   │   │   ├── DailyCard.tsx
│   │   │   └── FavoriteButton.tsx
│   │   ├── library/             # Library-specific components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterTabs.tsx
│   │   │   ├── PrincipleList.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── quiz/                # Quiz-specific components
│   │   │   ├── Flashcard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── SwipeGesture.tsx
│   │   └── shared/              # Shared across screens
│   │       ├── CategoryChip.tsx
│   │       ├── TypeBadge.tsx
│   │       └── ExampleImage.tsx
│   │
│   ├── store/                   # Zustand state management
│   │   ├── useFavorites.ts      # Favorite principles
│   │   ├── useDaily.ts          # Daily principle rotation
│   │   ├── useQuiz.ts           # Quiz progress & settings
│   │   └── useSettings.ts       # App preferences
│   │
│   ├── data/                    # Static content & types
│   │   ├── principles.json      # All 20 principles
│   │   ├── categories.json      # 4 categories with colors
│   │   ├── types.ts             # TypeScript interfaces
│   │   └── constants.ts         # App constants
│   │
│   ├── lib/                     # Utilities & services
│   │   ├── storage.ts           # MMKV wrapper functions
│   │   ├── search.ts            # Search & filtering logic
│   │   ├── daily-rotation.ts    # Daily principle algorithm
│   │   ├── share.ts             # Native sharing utilities
│   │   ├── navigation.ts        # Navigation helpers
│   │   └── utils.ts             # General utilities
│   │
│   └── theme/                   # Design system
│       ├── tokens.ts            # Colors, spacing, typography
│       ├── tailwind.config.js   # NativeWind configuration
│       └── types.ts             # Theme type definitions
│
├── assets/                      # Static assets
│   ├── images/                  
│   │   ├── principles/          # Principle illustrations
│   │   │   ├── hicks-law.png
│   │   │   ├── fitts-law.png
│   │   │   └── ... (15+ images)
│   │   ├── categories/          # Category icons
│   │   └── branding/            # App logo, splash
│   ├── icons/                   # App icons (iOS/Android)
│   └── fonts/                   # Custom fonts (if needed)
│
├── docs/                        # Documentation
│   ├── MVP Tech Requirements - Revised.md
│   ├── Implementation Plan.md
│   ├── Project Structure.md
│   └── Content Guidelines.md
│
├── .expo/                       # Expo configuration
├── .vscode/                     # VS Code settings
├── node_modules/
├── package.json
├── package-lock.json
├── tsconfig.json
├── tailwind.config.js
├── app.json                     # Expo app configuration  
├── eas.json                     # EAS Build configuration
├── .eslintrc.js
├── .prettierrc
├── .gitignore
└── README.md
```

## Key Files Deep Dive

### App Router Structure (`/app`)
```typescript
// app/_layout.tsx - Root tab navigation
import { Tabs } from 'expo-router';
import { Home, Library, Quiz } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ 
        title: 'Today',
        tabBarIcon: ({ color }) => <Home color={color} />
      }} />
      <Tabs.Screen name="library" options={{ 
        title: 'Library',
        tabBarIcon: ({ color }) => <Library color={color} />
      }} />
      <Tabs.Screen name="quiz" options={{ 
        title: 'Practice',
        tabBarIcon: ({ color }) => <Quiz color={color} />
      }} />
    </Tabs>
  );
}
```

### Data Layer (`/src/data`)
```typescript
// src/data/types.ts
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
```

### Core Components (`/src/components/ui`)
```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'ghost' | 'outline';
  size: 'sm' | 'md' | 'lg';
  onPress: () => void;
  children: React.ReactNode;
  className?: string;
}

// src/components/ui/Card.tsx  
interface CardProps {
  elevated?: boolean;
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}
```

### State Management (`/src/store`)
```typescript
// src/store/useFavorites.ts
interface FavoritesStore {
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getFavoriteIds: () => string[];
}

// src/store/useDaily.ts
interface DailyStore {
  todaysPrinciple: Principle | null;
  getTodaysPrinciple: () => Principle;
  refreshDaily: () => void;
}
```

### Utilities (`/src/lib`)
```typescript
// src/lib/storage.ts
export const storage = {
  favorites: {
    get: (): Set<string> => { /* MMKV logic */ },
    set: (favorites: Set<string>) => { /* MMKV logic */ },
  },
  // ... other storage methods
};

// src/lib/search.ts
export function searchPrinciples(
  principles: Principle[], 
  query: string
): Principle[] {
  // Simple substring matching logic
}
```

## Development Workflow

### 1. Component Development
```bash
# Create new component with proper structure
src/components/[category]/ComponentName.tsx
src/components/[category]/__tests__/ComponentName.test.tsx
```

### 2. Screen Development  
```bash
# Expo Router automatically picks up files in /app
app/screen-name.tsx
# Component logic goes in /src/components/screen-name/
```

### 3. State Management
```bash
# Each feature gets its own store
src/store/useFeatureName.ts
# With proper TypeScript interfaces
```

### 4. Asset Management
```bash
# Images organized by feature
assets/images/principles/principle-slug.png
# Optimized with expo-optimize before committing
```

## Build Configuration

### EAS Build (`eas.json`)
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

### App Configuration (`app.json`)
```json
{
  "expo": {
    "name": "DESIGNSNACK Laws & Patterns",
    "slug": "designsnack-laws-patterns",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android"],
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "assets/**/*"
    ]
  }
}
```

## Quality Assurance Structure

### Testing Strategy
```
__tests__/
├── components/          # Component unit tests
├── screens/            # Screen integration tests  
├── lib/               # Utility function tests
└── e2e/               # End-to-end flow tests
```

### Code Quality
```
.eslintrc.js           # ESLint configuration
.prettierrc           # Prettier formatting
.vscode/settings.json # VS Code workspace settings
```

This structure provides:
✅ **Clear separation of concerns**
✅ **Scalable architecture** 
✅ **Type safety** throughout
✅ **Easy navigation** and development
✅ **Production-ready** organization