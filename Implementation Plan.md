# DESIGNSNACK Laws & Patterns - Implementation Plan

## Phase 1: Foundation Setup (Week 1)
**Goal:** Working Expo app with navigation and basic UI components

### 1.1 Project Initialization
- [ ] Create new Expo project with SDK 51+
- [ ] Configure TypeScript strict mode
- [ ] Set up Expo Router file-based navigation
- [ ] Install and configure NativeWind
- [ ] Set up ESLint + Prettier + pre-commit hooks

### 1.2 Design System & Core Components  
- [ ] Create design tokens (`src/theme/tokens.ts`)
- [ ] Configure Tailwind config with brand colors
- [ ] Build core components:
  - [ ] Button (primary, ghost variants)
  - [ ] Card (elevated, flat)
  - [ ] Chip (category/tag pills)
  - [ ] ListItem (for library)

### 1.3 Navigation Structure
- [ ] Set up Expo Router tabs:
  - [ ] `app/_layout.tsx` (tab navigator)
  - [ ] `app/index.tsx` (Home)
  - [ ] `app/library.tsx` (Library) 
  - [ ] `app/quiz.tsx` (Quiz)
  - [ ] `app/principle/[id].tsx` (Detail)

### 1.4 State Management Setup
- [ ] Install and configure Zustand
- [ ] Install and configure react-native-mmkv
- [ ] Create basic stores:
  - [ ] `useFavorites.ts`
  - [ ] `useDaily.ts`

**Deliverable:** Navigatable app with tabs and placeholder screens

---

## Phase 2: Content & Data Layer (Week 2)
**Goal:** Static content loading with proper data models

### 2.1 Data Models & Content Creation
- [ ] Define TypeScript interfaces for Principle, Category
- [ ] Create `src/data/principles.json` with 20 curated principles:
  - [ ] 10 UX Laws (Fitts, Hick's, Miller's, Jakob's, etc.)
  - [ ] 7 Cognitive Biases (Confirmation, Anchoring, Loss Aversion, etc.)  
  - [ ] 3 Heuristics (Recognition over Recall, etc.)
- [ ] Create `src/data/categories.json` with 4 categories
- [ ] Write compelling one-liners and definitions for each principle

### 2.2 Asset Preparation
- [ ] Create/source 15+ principle illustration images
- [ ] Optimize images with expo-optimize
- [ ] Organize in `assets/images/principles/`
- [ ] Create app icons and splash screens

### 2.3 Storage Layer
- [ ] Implement MMKV storage utilities
- [ ] Create favorites management functions
- [ ] Test persistence across app restarts

**Deliverable:** Rich content loaded and accessible in app

---

## Phase 3: Home Screen & Daily Rotation (Week 3)  
**Goal:** Working "Today's Law" with favorites and smooth UX

### 3.1 Daily Rotation Algorithm
- [ ] Implement deterministic daily selection logic
- [ ] Add anti-repeat mechanism (exclude last 7 days)
- [ ] Weight favorites 1.5x in selection
- [ ] Test rotation works correctly across days

### 3.2 Home Screen Implementation
- [ ] Hero card component showing daily principle
- [ ] Display: title, one-liner, category chip, example image
- [ ] Favorite star toggle with haptic feedback
- [ ] "Learn More" button → navigate to detail
- [ ] Smooth loading states

### 3.3 Visual Polish
- [ ] Add subtle animations (card appear, favorite toggle)
- [ ] Implement proper image loading with placeholders
- [ ] Test on different screen sizes
- [ ] Add haptic feedback for interactions

**Deliverable:** Engaging home screen that changes daily

---

## Phase 4: Library & Search (Week 4)
**Goal:** Browse and discover all principles with search

### 4.1 Library Screen Layout
- [ ] Search bar with debounced input (300ms)
- [ ] Filter tabs: All | UX Laws | Biases | Heuristics  
- [ ] Principle list with ListItem components
- [ ] Empty states and loading indicators

### 4.2 Search Implementation
- [ ] Simple substring matching across title, one-liner, tags
- [ ] Case-insensitive search with trimmed input
- [ ] "No results" state with popular tag suggestions
- [ ] Performance optimization for smooth typing

### 4.3 List Interactions
- [ ] Favorite toggle in list items
- [ ] Smooth navigation to detail screens
- [ ] Pull-to-refresh (optional)
- [ ] Proper VoiceOver support

**Deliverable:** Discoverable library with working search

---

## Phase 5: Detail Views & Deep Content (Week 5)
**Goal:** Rich principle detail screens with full content

### 5.1 Detail Screen Layout
- [ ] Title + one-liner header
- [ ] Type badge + category chip
- [ ] Definition paragraph (2-3 sentences)
- [ ] "When to Apply" list
- [ ] Do/Don't checklists with proper icons
- [ ] Example image with caption
- [ ] Tappable tags → search integration
- [ ] Sources with external link handling

### 5.2 Detail Screen Features
- [ ] Favorite star in navigation header
- [ ] Native share functionality (formatted text)
- [ ] Smooth back navigation
- [ ] Proper content scrolling
- [ ] Last-read persistence

### 5.3 Polish & Accessibility
- [ ] Dynamic Type support
- [ ] VoiceOver labels and navigation order
- [ ] Proper color contrast
- [ ] Loading states for images

**Deliverable:** Information-rich detail screens

---

## Phase 6: Quiz & Flashcards (Week 6)
**Goal:** Simple flashcard practice mode

### 6.1 Flashcard Component
- [ ] Flashcard component with flip animation  
- [ ] Front: Principle title + "What is this principle?"
- [ ] Back: One-liner + brief definition
- [ ] Smooth flip animation with Reanimated

### 6.2 Quiz Screen Logic
- [ ] Random principle selection (favorites priority)
- [ ] Swipe gestures: ← "Need Review", → "Got It"  
- [ ] Progress tracking in MMKV
- [ ] Session stats (cards reviewed, accuracy)

### 6.3 Quiz Features
- [ ] Settings: favorites only vs all principles
- [ ] Progress visualization
- [ ] Reset progress option
- [ ] Haptic feedback for swipes

**Deliverable:** Engaging flashcard practice mode

---

## Phase 7: Final Polish & Testing (Week 7)
**Goal:** Production-ready app with excellent UX

### 7.1 Performance Optimization
- [ ] Lazy load detail and quiz screens
- [ ] Optimize bundle size (target < 25MB)
- [ ] Improve startup time (target < 2s)
- [ ] Memory usage optimization

### 7.2 Accessibility & Quality
- [ ] Full VoiceOver audit and fixes
- [ ] Dynamic Type testing
- [ ] Color contrast validation (WCAG AA)
- [ ] Minimum 44pt touch targets verification

### 7.3 Cross-Platform Testing
- [ ] iOS testing (multiple devices/simulators)
- [ ] Android testing (various screen sizes)
- [ ] Edge case handling (no content, network issues)
- [ ] Performance testing on mid-range devices

### 7.4 Build & Deploy Prep
- [ ] Configure EAS Build for iOS/Android
- [ ] App store assets (screenshots, descriptions)
- [ ] Privacy policy and terms (basic)
- [ ] Beta testing with TestFlight/Internal Testing

**Deliverable:** Production-ready app ready for app stores

---

## Technical Milestones

### Week 1 Checkpoint
- ✅ App launches and navigates between tabs
- ✅ Basic UI components render correctly  
- ✅ TypeScript compiles without errors

### Week 3 Checkpoint  
- ✅ "Today's Law" shows different principle each day
- ✅ Content loads from JSON correctly
- ✅ Favorites persist across app restarts

### Week 5 Checkpoint
- ✅ Search returns relevant results in <200ms
- ✅ Detail screens load completely in <300ms
- ✅ All principle content displays properly

### Week 7 Checkpoint
- ✅ App works fully offline after install
- ✅ Passes basic accessibility audit
- ✅ Successfully builds for iOS + Android via EAS

## Risk Mitigation

### High Risk Items
1. **Content Quality** - Start curating content early, get feedback
2. **Performance** - Test on real devices frequently, not just simulators  
3. **App Store Approval** - Follow guidelines strictly, prepare for review

### Contingency Plans
- **Content Behind Schedule** → Reduce to 15 principles, focus on quality
- **Performance Issues** → Remove non-essential animations, optimize images
- **Technical Blockers** → Have React Navigation backup for Expo Router

## Success Criteria
- [ ] App launches in <2 seconds on iPhone 12/Pixel 5
- [ ] Bundle size <25MB on both platforms
- [ ] Zero TypeScript errors in strict mode
- [ ] All 20 principles have complete, high-quality content
- [ ] Passes VoiceOver accessibility test
- [ ] 4.5+ star rating potential based on beta feedback

## Next Steps
1. **Approve this plan** and timeline
2. **Set up development environment** (Expo CLI, EAS account)  
3. **Start Phase 1** with project initialization
4. **Weekly check-ins** to track progress and adjust scope

Ready to start building? 🚀