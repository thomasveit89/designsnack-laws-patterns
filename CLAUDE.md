# DESIGNSNACK Laws & Patterns - Claude Code Reference

## 🏗️ Project Architecture

### Frontend: React Native Expo App
**Location:** `/Users/thomasveit/Websites/DESIGNSNACK Laws & Patterns/designsnack-laws-patterns/`
- **Framework:** React Native with Expo
- **Styling:** NativeWind (Tailwind CSS)
- **Navigation:** Expo Router (file-based routing)
- **Storage:** React Native MMKV for caching
- **State Management:** Zustand stores

### Backend: Vercel Serverless API
**Location:** `/Users/thomasveit/Websites/DESIGNSNACK Laws & Patterns/designsnack-laws-patterns-backend/`
- **Runtime:** Node.js with TypeScript
- **Database:** Supabase (PostgreSQL)
- **AI Service:** OpenAI GPT-4 for question generation
- **Deployment:** Vercel serverless functions
- **URL:** `https://designsnack-laws-patterns-backend.vercel.app`

---

## 📱 Frontend Structure

### Key Directories
```
/app/                          # Expo Router pages
├── (tabs)/                    # Tab navigation
│   ├── index.tsx             # Library screen (default home)
│   ├── quiz.tsx              # Practice screen
│   └── _layout.tsx           # Tab layout config
├── principle/[id].tsx        # Principle detail view
├── flashcards.tsx            # Flashcard practice
├── quiz-setup.tsx            # Quiz configuration
└── quiz-session.tsx          # Active quiz screen

/src/
├── components/               # Reusable UI components
├── lib/                     # Core services
│   ├── api.ts              # Backend API client
│   ├── openai.ts           # Quiz generation logic
│   ├── questionCache.ts    # Question caching system
│   ├── storage.ts          # MMKV storage wrapper
│   └── config.ts           # App configuration
├── store/                  # Zustand state stores
└── data/                   # Static data & types
```

### Important Configuration
- **Safe Areas:** Dynamic handling with `useSafeAreaInsets()`
- **Navigation:** File-based routing, no home tab (Library is default index)
- **Styling:** NativeWind classes, avoid native styling
- **Icons:** SF Symbols via `IconSymbol` component

---

## 🗄️ Backend Structure

### API Endpoints
```
/api/
├── principles.ts           # CRUD for UX principles
├── quiz/
│   ├── questions.ts       # Get quiz questions
│   ├── generate.ts        # Generate new questions
│   └── sync.ts           # Sync questions
└── health.ts             # Health check
```

### Core Services
```
/lib/
├── supabase.ts            # Database service layer
├── openai.ts              # OpenAI integration + question generation
└── types.ts               # Shared TypeScript types
```

### Scripts
```
/scripts/
├── generate-questions.ts  # Bulk question generation
├── seed-questions.ts     # Database seeding
└── add-principle.ts      # Add new principles
```

---

## 🔄 Data Flow Architecture

### Quiz Question Generation
```
1. User starts quiz
   ↓
2. App calls /api/quiz/questions
   ↓
3. Backend checks Supabase database
   ↓
4. If questions exist → Return from DB
   ↓
5. If no questions → Generate with OpenAI → Store in DB → Return
   ↓
6. App caches questions locally (MMKV)
   ↓
7. Display quiz to user
```

### Fallback Strategy (Priority Order)
1. **Live Backend API** - Fresh questions from Supabase
2. **Local Cache** - Previously fetched questions (expires: dev 24h, prod 7d)
3. **Client Fallback** - Simple generated questions using principle data

---

## 🗃️ Database Schema (Supabase)

### Principles Table
- `id` (uuid, primary key)
- `type` (ux_law | cognitive_bias | heuristic)
- `title`, `one_liner`, `definition`
- `applies_when`, `do_items`, `dont_items`
- `category`, `tags`, `sources`

### Questions Table
- `id` (uuid, primary key)
- `principle_id` (foreign key)
- `question`, `options` (text array)
- `correct_answer` (integer 0-3)
- `explanation`, `difficulty`
- `quality_score` (integer 1-10)

---

## ⚡ Recent Critical Fixes

### Quiz Answer Randomization Bug (FIXED ✅)
**Issue:** Correct answers were always "A" regardless of content
**Root Cause:** Flawed `shuffleAnswerPosition` logic in `backend/lib/openai.ts:240-268`
**Solution:**
- Fixed shuffling algorithm to properly randomize across A,B,C,D positions
- Cleared all buggy questions from database
- Regenerated 72 questions with balanced distribution
- Verified: A(25.1%), B(23.7%), C(29.4%), D(21.8%)

### UI Consistency Improvements
- Applied card-based layout across Practice, Flashcards, Quiz Setup screens
- Fixed TouchableOpacity transparency bug by separating touch handling from styling
- Made all screens scrollable with proper safe area handling
- Removed home screen, made Library the default index tab

---

## 🛠️ Development Commands

### Frontend (React Native)
```bash
cd "/Users/thomasveit/Websites/DESIGNSNACK Laws & Patterns/designsnack-laws-patterns"
npm run start                # Start Expo dev server
npm run reset-project        # Reset Expo project
npx expo start --port 8082   # Start on specific port
```

### Backend (API)
```bash
cd "/Users/thomasveit/Websites/DESIGNSNACK Laws & Patterns/designsnack-laws-patterns-backend"
npm run dev                  # Local development with Vercel
npm run deploy               # Deploy to production

# Database Operations (require .env)
npx dotenv -e .env -- npx tsx scripts/generate-questions.ts --questions 3 --difficulty medium
npx dotenv -e .env -- npx tsx scripts/add-principle.ts
```

### Environment Variables
Backend requires:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

---

## 🎯 Key Technical Patterns

### Component Architecture
- Separate `TouchableOpacity` from styled `View` components to avoid opacity conflicts
- Use `activeOpacity={0.8}` for consistent touch feedback
- Apply consistent card styling: `bg-white rounded-2xl p-6 shadow-sm border border-gray-100`

### State Management
- Zustand stores for global state (principles, favorites)
- Local state with React hooks for component-specific data
- MMKV for persistent caching and offline support

### Error Handling
- Try backend API first, fallback to cache, then client generation
- Comprehensive error logging with specific error messages
- Graceful degradation for offline scenarios

### Performance
- Question caching reduces API calls and improves offline experience
- Lazy loading of principle details
- Optimized bundle size with proper imports

---

## 🚀 Future Enhancement Ideas

### Near-term MVP Focus
1. **Content Expansion**
   - Add more UX principles with images
   - Enhance principle descriptions and examples
   - Add principle categories and filtering

2. **User Experience**
   - Progress tracking and streaks
   - Personalized difficulty adjustment
   - Study statistics and analytics

### Advanced Features (Potential Pro)
1. **AI Image Analysis**
   - Upload app/website screenshots
   - AI analyzes design against principles
   - Provides improvement suggestions
   - Monetization opportunity

2. **Social Features**
   - Share quiz results
   - Leaderboards and challenges
   - Study groups and discussions

---

## 🐛 Debugging Tips

### Common Issues
1. **TouchableOpacity Transparency:** Separate touch handling from conditional styling
2. **Safe Area Problems:** Use manual padding with `paddingTop: insets.top`
3. **Cache Issues:** Clear cache with `/scripts/clear-quiz-cache.ts`
4. **Backend Errors:** Check Vercel logs and Supabase dashboard

### Testing Commands
```bash
# Test API connectivity
curl "https://designsnack-laws-patterns-backend.vercel.app/api/health"

# Clear question cache
cd designsnack-laws-patterns && npx tsx scripts/clear-quiz-cache.ts

# Check running background processes
# Background Bash processes may be running on ports 8081/8082
```

---

## 📝 Code Standards

- **TypeScript:** Strict mode enabled, proper type definitions
- **Styling:** NativeWind/Tailwind classes only, avoid native styles
- **Comments:** Minimal, focus on complex business logic only
- **Imports:** Absolute imports with `@/` prefix for src directory
- **Error Handling:** Comprehensive try/catch with meaningful messages
- **Performance:** Cache frequently accessed data, minimize re-renders

---

*Last Updated: September 2025 - Post Quiz Bug Fix*