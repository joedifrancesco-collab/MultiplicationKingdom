# Learning Kingdom Folder Structure

**Phase 0 Sprint 0.2: Planning Document**  
Created: April 14, 2026

---

## Target Structure (After Phase 1 File Migration)

```
learning-kingdom/
│
├── src/
│   ├── App.jsx                 ← Main router (no changes)
│   ├── main.jsx                ← React boot (no changes)
│   ├── index.css               ← Global theme & variables (no changes)
│   │
│   ├── shared/                 ← ✨ NEW: Reusable across all subjects
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── ErrorBoundary.css
│   │   │   ├── NavBar.jsx      ← ⚠️ Will be redesigned in Phase 5
│   │   │   ├── NavBar.css
│   │   │   ├── AuthScreen.jsx
│   │   │   ├── AuthScreen.css
│   │   │   ├── HomeScreen.jsx
│   │   │   ├── HomeScreen.css
│   │   │   └── UnifiedLeaderboard.jsx  ← ✨ NEW (Phase 3)
│   │   │       (and .css)
│   │   │
│   │   ├── hooks/
│   │   │   └── useSound.js     ← Moved from src/hooks/
│   │   │
│   │   ├── utils/
│   │   │   ├── soundManager.js ← Moved from src/utils/
│   │   │   ├── contentFilter.js
│   │   │   └── ...
│   │   │
│   │   └── config/
│   │       └── firebase.js     ← Moved from src/config/
│   │
│   ├── subjects/               ← ✨ NEW: Subject-organized structure
│   │
│   │   ├── math-kingdom/
│   │   │   ├── multiplication-kingdom/
│   │   │   │   ├── components/
│   │   │   │   │   ├── KingdomMap.jsx / KingdomMap.css
│   │   │   │   │   ├── KingdomScreen.jsx / KingdomScreen.css
│   │   │   │   │   ├── Flashcard.jsx / Flashcard.css
│   │   │   │   │   ├── SpeedChallenge.jsx / SpeedChallenge.css
│   │   │   │   │   ├── MatchGame.jsx / MatchGame.css
│   │   │   │   │   ├── FlashcardMenu.jsx / FlashcardMenu.css
│   │   │   │   │   ├── FlashcardGame.jsx / FlashcardGame.css
│   │   │   │   │   ├── KingdomSiege.jsx / KingdomSiege.css
│   │   │   │   │   ├── TrainingMenu.jsx / TrainingMenu.css
│   │   │   │   │   ├── TrainingTable.jsx / TrainingTable.css
│   │   │   │   │   ├── KingdomMapsMode.jsx / KingdomMapsMode.css
│   │   │   │   │   └── KingdomMaps.jsx / KingdomMaps.css
│   │   │   │   │
│   │   │   │   ├── data/
│   │   │   │   │   └── questions.js  ← Moved from src/data/
│   │   │   │   │
│   │   │   │   └── config/
│   │   │   │       └── kingdomMapsConfig.js  ← Moved from src/config/
│   │   │   │
│   │   │   └── [future: other math subjects]
│   │   │       ├── fractions/
│   │   │       ├── geometry/
│   │   │       └── ...
│   │   │
│   │   ├── language-arts-kingdom/
│   │   │   ├── spelling/
│   │   │   │   ├── components/
│   │   │   │   │   ├── SpellingScreen.jsx / SpellingScreen.css
│   │   │   │   │   ├── SpellingPractice.jsx / SpellingPractice.css
│   │   │   │   │   ├── SpellingLeaderboard.jsx / SpellingLeaderboard.css
│   │   │   │   │   └── SpellingAdmin.jsx / SpellingAdmin.css
│   │   │   │   │
│   │   │   │   ├── data/
│   │   │   │   │   └── words.js  ← Moved from src/data/
│   │   │   │   │
│   │   │   │   └── config/
│   │   │   │       └── spellingConfig.js  ← If needed
│   │   │   │
│   │   │   └── [future: other LA subjects]
│   │   │       ├── phonics/
│   │   │       ├── grammar/
│   │   │       └── ...
│   │   │
│   │   ├── science-kingdom/      ← ✨ Placeholder for future
│   │   │   └── [tbd]
│   │   │
│   │   └── ...more subjects
│   │
│   ├── store/
│   │   └── progress.js          ← No changes (shared by all)
│   │
│   └── data/
│       └── numberCruncher.js    ← Kept here or move to its own subject?
│
├── android/                     ← No changes
├── public/                      ← No changes
└── [root config files]          ← No changes
```

---

## Component Classification

### 🔒 Shared (Used Across Multiple Subjects)

**Components:**
- `ErrorBoundary` — Whole app error handling
- `NavBar` — Main navigation (⚠️ redesigned in Phase 5)
- `AuthScreen` — Authentication entry point
- `HomeScreen` — Subject/game selection hub
- `UnifiedLeaderboard` — Consolidated leaderboard (new in Phase 3)

**Hooks:**
- `useSound()` — Sound playback (used by all games)

**Utils:**
- `soundManager.js` — Low-level sound API
- `contentFilter.js` — Profanity filtering
- `geminiSentenceGenerator.js` — Sentence generation (if used by multiple subjects)

**Config:**
- `firebase.js` — Firebase initialization

**Store:**
- `progress.js` — Auth, localStorage, Firestore sync (whole app)

### 🧮 Math Kingdom

**Subject:** Multiplication Kingdom (1–12 times tables)

**Components:**
- `KingdomMap` — Grid of 12 kingdoms
- `KingdomScreen` — Three game buttons per kingdom
- `Flashcard`, `SpeedChallenge`, `MatchGame` — Three game modes in kingdoms
- `FlashcardMenu`, `FlashcardGame` — Separate flashcard challenge
- `KingdomSiege` — Tower defense game
- `TrainingMenu`, `TrainingTable` — Multiplication table training
- `KingdomMapsMode`, `KingdomMaps` — Grid/map games

**Data:**
- `questions.js` — All multiplication questions (1–12 tables)

**Config:**
- `kingdomMapsConfig.js` — Game parameters (grid size, time limits, etc.)

**Future Extensions:**
- Fractions Kingdom
- Geometry Kingdom
- Algebra Kingdom
- etc.

### 📚 Language Arts Kingdom

**Subject:** Spelling

**Components:**
- `SpellingScreen` — Subject home
- `SpellingPractice` — Main spelling game
- `SpellingLeaderboard` — Results tracking (will merge into UnifiedLeaderboard in Phase 3)
- `SpellingAdmin` — Word list admin

**Data:**
- `words.js` — Spelling word lists

**Config:**
- `spellingConfig.js` — Word parameters (optional)

**Future Extensions:**
- Phonics Kingdom
- Grammar Kingdom
- Vocabulary Kingdom
- etc.

### 🔢 Number Cruncher (TBD)

**Current location:** `src/components/number-cruncher/`

**Question:** Should this become a subject under Math Kingdom, or stay separate?

**Options:**
1. **Under Math Kingdom:**
   ```
   src/subjects/math-kingdom/number-cruncher/ ← as a separate module at same level as multiplication-kingdom
   ```

2. **Separate top-level subject:**
   ```
   src/subjects/number-entry-kingdom/ (or similar)
   ```

**Recommendation:** Option 1 - Keep it as a peer to multiplication-kingdom under Math Kingdom.

---

## Files Staying in Root

| File | Reason |
|------|--------|
| `App.jsx` | Main router, orchestrates all subjects |
| `main.jsx` | React boot code |
| `index.css` | Global theme + CSS variables |
| `index.html` | HTML entry point |
| `vite.config.js` | Build config |
| `package.json` | Dependencies |
| `tsconfig.json` (if exists) | TypeScript config |
| `eslint.config.js` | Linting config |
| `capacitor.config.json` | Android/Capacitor config |

---

## Import Path Refactoring

After file moves, update import paths:

### Example: Before → After

**Before (current):**
```jsx
import { KINGDOMS } from '../data/questions';
import useSound from '../hooks/useSound';
import { saveGameScore } from '../store/progress';
```

**After (Multiplication Kingdom component):**
```jsx
// Question data
import { KINGDOMS } from '../../data/questions';  // Same subject

// Shared
import useSound from '../../../shared/hooks/useSound';
import { saveGameScore } from '../../../store/progress';
```

**After (Spelling component):**
```jsx
// Word data
import { fetchSpellingWordsFromFirebase } from '../../data/words';  // Same subject

// Shared
import useSound from '../../../shared/hooks/useSound';
import { saveGameScore } from '../../../store/progress';
```

---

## Organizational Principles

### 1. **Co-location**
Each subject is fully self-contained:
- Components, data, config all live in the same `subject/` folder tree
- Easy to find related files
- Easy to extract/move a subject later

### 2. **Consistency**
Each subject follows the same pattern:
```
subject-name/
├── game-module/
│   ├── components/
│   ├── data/
│   └── config/
└── ...
```

### 3. **Shared is Minimal**
Only things used by 2+ subjects go in `shared/`:
- UI components (ErrorBoundary, NavBar, HomeScreen)
- Hooks (useSound)
- Utilities (soundManager, contentFilter)
- Storage/Auth (progress.js, firebase.js)

### 4. **Import Direction**
```
subjects/
  └─ math-kingdom/
      └─ multiplication-kingdom/
          → imports FROM shared/ ✅
          → imports FROM store/ ✅
          → does NOT import FROM language-arts-kingdom/spelling/ ❌
```

Subjects are isolated and never cross-import.

---

## Phase 1 Migration Checklist

### Sprint 1.1: Create Folder Structure
- [ ] Create `src/shared/` directory
- [ ] Create `src/shared/components/`
- [ ] Create `src/shared/hooks/`
- [ ] Create `src/shared/utils/`
- [ ] Create `src/shared/config/`
- [ ] Create `src/subjects/` directory
- [ ] Create `src/subjects/math-kingdom/multiplication-kingdom/`
- [ ] Create `src/subjects/language-arts-kingdom/spelling/`
- [ ] **Commit:** `refactor: create new folder structure (no file moves yet)`

### Sprint 1.2: Move Shared Components
- [ ] Move `ErrorBoundary.jsx` → `src/shared/components/`
- [ ] Move `NavBar.jsx` + `.css` → `src/shared/components/`
- [ ] Move `AuthScreen.jsx` + `.css` → `src/shared/components/`
- [ ] Move `HomeScreen.jsx` + `.css` → `src/shared/components/`
- [ ] Move `Leaderboard.jsx` + `.css` → `src/shared/components/` (will be replaced in Phase 3)
- [ ] Move `useSound.js` → `src/shared/hooks/`
- [ ] Move `src/utils/*` → `src/shared/utils/`
- [ ] Move `src/config/firebase.js` → `src/shared/config/`
- [ ] Update imports in `App.jsx`
- [ ] **Commit:** `refactor: move shared components to src/shared/`

### Sprint 1.3: Move Math Kingdom → Multiplication Kingdom
- [ ] Move 13 components to `src/subjects/math-kingdom/multiplication-kingdom/components/`
- [ ] Move `questions.js` → `src/subjects/math-kingdom/multiplication-kingdom/data/`
- [ ] Move `kingdomMapsConfig.js` → `src/subjects/math-kingdom/multiplication-kingdom/config/`
- [ ] Update all import paths
- [ ] Test routes still work
- [ ] **Commit:** `refactor: move multiplication kingdom to src/subjects/math-kingdom/`

### Sprint 1.4: Move Language Arts → Spelling
- [ ] Move 4 components to `src/subjects/language-arts-kingdom/spelling/components/`
- [ ] Move `words.js` → `src/subjects/language-arts-kingdom/spelling/data/`
- [ ] Update all import paths
- [ ] **Commit:** `refactor: move spelling to src/subjects/language-arts-kingdom/`

---

## Routing Implications

After Phase 2 (routes refactored), the routing structure will mirror folder structure:

**Current routes:**
```
/kingdom                    → KingdomMap
/kingdom/:id              → KingdomScreen
/kingdom/:id/flashcard    → Flashcard
/flashcards               → FlashcardMenu
/spelling                 → SpellingScreen
```

**Future routes (Phase 2):**
```
/subjects/math-kingdom/multiplication-kingdom        → KingdomMap
/subjects/math-kingdom/multiplication-kingdom/:id    → KingdomScreen
/subjects/language-arts-kingdom/spelling             → SpellingScreen
```

Old routes kept as redirects for backward compatibility during transition.

---

## Summary

| Phase | What Happens | When |
|-------|-------------|------|
| **Phase 1** | Files physically reorganized into new structure | Sprints 1.1–1.4 |
| **Phase 2** | Import paths updated, routes refactored | Sprints 2.1–2.3 |
| **Phase 3–8** | Features added within new structure | Later phases |

**End State:** 
- ✅ App organized by subject (Math, Language Arts, etc.)
- ✅ Each subject fully modular and self-contained
- ✅ Shared utilities centralized
- ✅ Easy to add new subjects or remove old ones
- ✅ Clear separation of concerns

---

## Questions & Decisions

1. **Number Cruncher placement?** Currently suggested under Math Kingdom. Confirm OK?
2. **Shared config files?** Should `appsettings.json` go in `src/shared/config/` or `src/config/`?
3. **Component re-exports?** Should `src/index.js` export common shared components, or import directly?
4. **CSS organization?** Keep CSS co-located with components (current), or centralize?

**All to be decided in subsequent sprints.**
