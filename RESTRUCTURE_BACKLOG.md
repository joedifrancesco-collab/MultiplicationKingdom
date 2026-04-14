# Learning Kingdom Restructure — Master Backlog

**Branch:** `restructure/learning-kingdom`  
**Status:** Planning  
**Created:** April 14, 2026

---

## Vision

Transform Multiplication Kingdom into **Learning Kingdom** — a modular, multi-subject educational platform with:
- **Flexible folder structure** supporting Math, Language Arts, and future subjects
- **Unified UI/UX** consistent across desktop and mobile
- **Consolidated leaderboards** with guest + signed-in user flows
- **Device-aware gaming** (flag each game as desktop/mobile/both)
- **Configurable game parameters** via appsettings.json
- **Intuitive navigation** responsive to device size

---

## Work Phases

### Phase 0: Foundation & Setup (Weeks 1–2)
Rename the app, plan folder structure, set up new architecture.

#### Sprint 0.1: App Rename
- [ ] Rename `src/` folder context references: "Multiplication Kingdom" → "Learning Kingdom"
- [ ] Update `package.json` name
- [ ] Update `README.md` to reflect new name
- [ ] Update route URLs conceptually (plan, don't execute yet)
- [ ] **Commit:** `refactor: rename app to Learning Kingdom`

#### Sprint 0.2: Plan New Folder Structure
- [ ] Document proposed folder tree
- [ ] Identify shared components (Leaderboard, NavBar, ErrorBoundary, etc.)
- [ ] Identify subject-specific components (Spelling, Multiplication, etc.)
- [ ] Identify files that stay in root (App.jsx, main.jsx, vite.config.js, etc.)
- [ ] **Artifact:** FOLDER_STRUCTURE.md (reference doc, not code yet)

#### Sprint 0.3: Create appsettings.json
- [ ] Define schema for game parameters (difficulty, time limits, scoring multipliers)
- [ ] Create default `appsettings.json` in `src/config/`
- [ ] Document parameter inheritance (can override per game or globally)
- [ ] **Commit:** `chore: add appsettings.json with configurable game parameters`

**End of Phase 0:** App renamed, structure planned, settings framework in place.

---

### Phase 1: File Migration & Folder Reorganization (Weeks 3–5)

#### Sprint 1.1: Create Folder Structure
- [ ] Create `src/shared/` (Leaderboard, NavBar, ErrorBoundary, Auth components)
- [ ] Create `src/subjects/`
- [ ] Create `src/subjects/math-kingdom/`
- [ ] Create `src/subjects/math-kingdom/multiplication-kingdom/`
- [ ] Create `src/subjects/language-arts-kingdom/`
- [ ] Create `src/subjects/language-arts-kingdom/spelling/`
- [ ] Create `src/data/shared/` (questions.js stays, words.js migrates, etc.)
- [ ] **Commit:** `refactor: create new folder structure (no file moves yet)`

#### Sprint 1.2: Move Shared Components
Move to `src/shared/` and update imports:
- [ ] HomeScreen, HeaderNav, ErrorBoundary
- [ ] AuthScreen, Leaderboard (legacy)
- [ ] NavBar
- [ ] Update imports in App.jsx
- [ ] **Commit:** `refactor: move shared components to src/shared/`

#### Sprint 1.3: Move Math Kingdom → Multiplication Kingdom
Move to `src/subjects/math-kingdom/multiplication-kingdom/`:
- [ ] KingdomMap, KingdomScreen, KingdomMaps, etc.
- [ ] Flashcard, SpeedChallenge, MatchGame, KingdomSiege
- [ ] Move `data/questions.js` → `src/subjects/math-kingdom/data/questions.js`
- [ ] Update all import paths
- [ ] Test routes still work (may need route adjustments)
- [ ] **Commit:** `refactor: move multiplication kingdom to src/subjects/math-kingdom/`

#### Sprint 1.4: Move Language Arts → Spelling
Move to `src/subjects/language-arts-kingdom/spelling/`:
- [ ] SpellingScreen, SpellingPractice, SpellingLeaderboard, SpellingAdmin
- [ ] Move `data/words.js` → `src/subjects/language-arts-kingdom/data/words.js`
- [ ] Update import paths
- [ ] **Commit:** `refactor: move spelling to src/subjects/language-arts-kingdom/`

**End of Phase 1:** All files reorganized, imports updated, app still runs.

---

### Phase 2: Code Refactoring & Shared Utilities (Weeks 6–7)

#### Sprint 2.1: Extract Shared Game Loop Logic
Create `src/shared/hooks/useGameLoop.js`:
- [ ] Abstract common game flow (question → input → validate → score → next)
- [ ] Used by Flashcard, SpeedChallenge, MatchGame, SpellingPractice
- [ ] **Commit:** `refactor: extract shared game loop hook`

#### Sprint 2.2: Routing Refactoring
Update `App.jsx` routes to match new structure:
- [ ] `/kingdom` → `/subjects/math-kingdom/multiplication-kingdom`
- [ ] `/flashcards` → `/subjects/math-kingdom/multiplication-kingdom/flashcards`
- [ ] `/spelling` → `/subjects/language-arts-kingdom/spelling`
- [ ] Keep old routes as redirects for now (add deprecation warning)
- [ ] **Commitment:** Keep backward compatibility during transition
- [ ] **Commit:** `refactor: update routes for new folder structure`

#### Sprint 2.3: Consolidate Config & Utils
- [ ] Merge kingdomMapsConfig.js into appsettings.json
- [ ] Move shared utilities to `src/shared/utils/`
- [ ] **Commit:** `refactor: consolidate config and utilities`

**End of Phase 2:** Codebase refactored, shared logic extracted, old routes deprecated.

---

### Phase 3: Unified Leaderboards & User Flows (Weeks 8–9)

#### Sprint 3.1: New Leaderboard Architecture
Create unified leaderboard system:
- [ ] Create `src/shared/components/UnifiedLeaderboard.jsx`
- [ ] Design data schema: `{ gameType, playerId, score, timestamp, device }`
- [ ] Leaderboard shows:
  - Signed-in user: **only their own scores** across all games
  - Guest user: **session-only scores** (not persisted initially)
- [ ] Add "View Global Stats" toggle (future feature) — disabled for MVP
- [ ] **Commit:** `feat: create unified leaderboard component`

#### Sprint 3.2: Guest Mode & Score Persistence
- [ ] Add `isGuest` flag to progress.js
- [ ] When guest plays → scores stored in sessionStorage
- [ ] On app exit (or navigating to home), if guest has scores → show "Save Your Scores" modal
- [ ] Modal offers: "Sign Up Now" or "Play as Guest Again"
- [ ] If sign up, transfer session scores to Firestore
- [ ] **Commit:** `feat: add guest mode with score save prompt`

#### Sprint 3.3: Migrate Existing Leaderboards
Replace all game-specific leaderboards with UnifiedLeaderboard:
- [ ] Remove MultiplicationTable leaderboard
- [ ] Remove SpellingLeaderboard
- [ ] Remove KingdomSiege leaderboard
- [ ] Replace with UnifiedLeaderboard in each game
- [ ] **Commit:** `refactor: migrate all leaderboards to unified system`

**End of Phase 3:** Single unified leaderboard, guest mode with save prompt, backward-compatible auth.

---

### Phase 4: Device Compatibility & Platform Awareness (Week 10)

#### Sprint 4.1: Device Flag System
Create device metadata for each game:
- [ ] Add to appsettings.json: `gamePlatforms: { "multiplicationFlashcard": "both", "speedChallenge": "both", "matchGame": "both", "kingdomSiege": "desktop", ... }`
- [ ] Add hook: `useDeviceType()` — returns "mobile", "tablet", "desktop" based on viewport
- [ ] Create `GameCard.jsx` component that:
  - Shows game thumbnail
  - Shows platform badge (🖥️, 📱, or both)
  - Disables card if device not supported
  - Shows tooltip: "This game is not available on [device]"
- [ ] **Commit:** `feat: add device compatibility flags and platform-aware UI`

#### Sprint 4.2: Test on Multiple Devices
- [ ] Test desktop (1920x1080)
- [ ] Test tablet (768x1024)
- [ ] Test mobile (375x667)
- [ ] Verify disabled games appear greyed out
- [ ] **Commit:** `test: verify device compatibility flags work across viewports`

**End of Phase 4:** Each game has platform flags, UI adapts to device, incompatible games disabled.

---

### Phase 5: Navigation Redesign (Weeks 11–12)

#### Sprint 5.1: Desktop Navigation Spec
Design desktop nav:
- [ ] Left sidebar (subject menu) or top navbar with dropdowns?
- [ ] Show all subjects + games in expanded view
- [ ] Highlight current subject/game
- [ ] Link to leaderboard, settings, profile
- [ ] **Decision document:** NAVIGATION_SPEC.md (ask for feedback before coding)

#### Sprint 5.2: Mobile Navigation Spec
Design mobile nav:
- [ ] Hamburger menu (collapsible sidebar) or bottom tab navigation?
- [ ] One-level hierarchy: Home → Subject → Game
- [ ] Minimize cognitive load (fewer taps to reach a game)
- [ ] Back button to return to subject
- [ ] **Decision document:** NAVIGATION_SPEC.md (add mobile section)

#### Sprint 5.3: Implement Responsive Navigation
- [ ] Create `src/shared/components/ResponsiveNav.jsx`
- [ ] Desktop mode: Sidebar nav
- [ ] Mobile mode: Hamburger + bottom nav
- [ ] Transitions between breakpoints
- [ ] Active state highlighting
- [ ] **Commit:** `feat: implement responsive navigation for desktop and mobile`

#### Sprint 5.4: Route Navigation Integration
- [ ] Update App.jsx routes for new nav structure
- [ ] Test navigation on all routes
- [ ] Ensure back/forward browser buttons work
- [ ] Test deep linking (paste URL, page loads correctly)
- [ ] **Commit:** `refactor: integrate navigation with routes`

**End of Phase 5:** Intuitive navigation, responsive, works on all devices.

---

### Phase 6: Parameterized Game Settings (Week 13)

#### Sprint 6.1: appsettings.json Schema
Finalize and document:
- [ ] Game difficulty levels (easy, medium, hard)
- [ ] Time limits (per game)
- [ ] Scoring formulae
- [ ] UI customization (colors, fonts, animations)
- [ ] **Commit:** `chore: document appsettings.json schema`

#### Sprint 6.2: Load Settings at Boot
- [ ] App loads `src/config/appsettings.json` on startup
- [ ] Validate schema (error if missing required keys)
- [ ] Export `useSettings()` hook for components
- [ ] **Commit:** `feat: load and validate game settings at boot`

#### Sprint 6.3: Create Simple Settings Admin UI (Future)
- [ ] Create `src/shared/components/SettingsAdmin.jsx`
- [ ] Allow editing select settings (time limits, difficulty)
- [ ] Save to localStorage (local overrides)
- [ ] Mark as "admin only" for future role-based access
- [ ] **Commit:** `feat: add settings admin UI (admin only)`

**End of Phase 6:** All game parameters editable, loaded from appsettings.json.

---

### Phase 7: Testing & QA (Weeks 14–15)

#### Sprint 7.1: Functional Testing
- [ ] Test all multiplication kingdom games work
- [ ] Test spelling works
- [ ] Test guest mode: play → exit → score save prompt
- [ ] Test signed-in mode: play → leaderboard shows only user's scores
- [ ] Test device flags disable incompatible games
- [ ] **Commit:** `test: pass functional test suite`

#### Sprint 7.2: Browser & Device Testing
- [ ] Test Chrome, Firefox, Safari, Edge (desktop)
- [ ] Test mobile browsers (Chrome mobile, Safari mobile)
- [ ] Test Android via Capacitor
- [ ] Test responsive design
- [ ] **Artifact:** TEST_RESULTS.md

#### Sprint 7.3: Performance Testing
- [ ] Measure app load time
- [ ] Measure game startup time
- [ ] Check bundle size (after all moves)
- [ ] Measure leaderboard query performance
- [ ] **Artifact:** PERFORMANCE_REPORT.md

**End of Phase 7:** All systems tested, QA sign-off.

---

### Phase 8: Documentation & Preparation for Merge (Week 16)

#### Sprint 8.1: Update Documentation
- [ ] Update [README.md](README.md) with new structure
- [ ] Update [.github/copilot-instructions.md](./.github/copilot-instructions.md) with new folder conventions
- [ ] Create [ARCHITECTURE.md](ARCHITECTURE.md) with detailed structure guide
- [ ] Document new routing scheme
- [ ] **Commit:** `docs: update documentation for new structure`

#### Sprint 8.2: Create Merge Strategy
- [ ] Identify conflicts with any `main` branch changes (if ongoing)
- [ ] Plan cherry-pick or rebase strategy
- [ ] Document merge checklist
- [ ] **Artifact:** MERGE_STRATEGY.md

#### Sprint 8.3: Final Review & Cleanup
- [ ] Code review (self + peer if available)
- [ ] Remove dead code / debug logs
- [ ] Final commit cleanup
- [ ] **Commit:** `chore: final cleanup before merge`

**End of Phase 8:** Ready for merge, all docs updated.

---

## Sprint Schedule

| Sprint | Phase | Duration | Goal |
|--------|-------|----------|------|
| 0.1–0.3 | Setup | Weeks 1–2 | Foundation ready |
| 1.1–1.4 | Migration | Weeks 3–5 | Files reorganized |
| 2.1–2.3 | Refactor | Weeks 6–7 | Code clean, routable |
| 3.1–3.3 | Leaderboards | Weeks 8–9 | Unified system, guest mode |
| 4.1–4.2 | Device Flags | Week 10 | Platform awareness |
| 5.1–5.4 | Navigation | Weeks 11–12 | Responsive nav |
| 6.1–6.3 | Settings | Week 13 | Parametrized |
| 7.1–7.3 | Testing | Weeks 14–15 | QA sign-off |
| 8.1–8.3 | Merge Prep | Week 16 | Ready to merge |

**Estimated Total:** 16 weeks (4 months)

---

## Commits Per Sprint

Each sprint should have 1–3 focused commits:
- Logical grouping of changes
- Commit message starts with `feat:`, `refactor:`, `chore:`, `test:`, `docs:`
- Runnable state after each commit (app should start, even if feature incomplete)

Example commit sequence for Phase 1:
```
refactor: create new folder structure (no file moves yet)
refactor: move shared components to src/shared/
refactor: move multiplication kingdom to src/subjects/math-kingdom/
refactor: move spelling to src/subjects/language-arts-kingdom/
```

---

## Branch Merge Strategy

**On `main` branch:** Continue with bug fixes, minor improvements, etc.

**On `restructure/learning-kingdom` branch:** Execute phases 0–8.

**Merge gate:**
- [ ] All tests pass
- [ ] No console errors
- [ ] Leaderboards working
- [ ] Guest mode working
- [ ] Navigation responsive
- [ ] Documentation updated

**Merge method:** Squash + merge (optional: keep commits if history is valuable)

---

## Decision Points Needing Your Input

1. **Navigation:**
   - Desktop: Sidebar or top navbar?
   - Mobile: Hamburger menu or bottom tabs?
   - → **Sprint 5.1–5.2 will create spec docs for your review**

2. **Subject Organization:**
   - Keep "Kingdom" suffix (Math Kingdom, Language Arts Kingdom)?
   - Or simplify to "Math", "Language Arts"?
   - → Decide before Sprint 1.1

3. **Leaderboard Privacy:**
   - Always signed-in users see only their scores?
   - Or show "Friends" leaderboard (future feature)?
   - → Currently spec'd as "only user's scores", can expand later

4. **Device Flags:**
   - Should kingdom siege be desktop-only, or both?
   - What about number cruncher?
   - → List these out before Sprint 4.1

5. **Timeline Flexibility:**
   - Is 4 months acceptable, or do you want to compress/expand?
   - Any phases that are higher priority?
   - → Let me know, I can adjust sprint sizes

---

## Files to Create/Modify

| File | Purpose | When |
|------|---------|------|
| RESTRUCTURE_BACKLOG.md | This file — master plan | Now |
| FOLDER_STRUCTURE.md | Visual tree of new structure | Sprint 0.2 |
| NAVIGATION_SPEC.md | Desktop/mobile nav design | Sprint 5.1–5.2 |
| ARCHITECTURE.md | Detailed code architecture guide | Sprint 8.1 |
| MERGE_STRATEGY.md | How to merge back to main | Sprint 8.2 |
| TEST_RESULTS.md | QA test matrix | Sprint 7.2 |
| PERFORMANCE_REPORT.md | Load times, bundle size | Sprint 7.3 |
| appsettings.json | Game parameters config | Sprint 0.3 |
| src/config/appsettings.schema.json | Schema validation (optional) | Sprint 6.1 |

---

## Success Metrics

✅ **Phase 0:** App renamed, settings framework in place  
✅ **Phase 1:** All files reorganized, imports working  
✅ **Phase 2:** Shared logic extracted, routing updated  
✅ **Phase 3:** Unified leaderboards, guest mode working  
✅ **Phase 4:** Device compatibility flags, UI responsive  
✅ **Phase 5:** Navigation intuitive on desktop & mobile  
✅ **Phase 6:** Game parameters editable via config  
✅ **Phase 7:** All systems QA tested  
✅ **Phase 8:** Merge-ready, docs updated  

**Overall:** Learning Kingdom ready for production with modular, scalable structure.

---

## Next Steps

1. Review this backlog
2. Confirm phase sequence and sprint sizes
3. **Decide on navigation approach** (will create spec docs in Sprint 5)
4. Get approval for decisions in "Decision Points" section
5. Begin Sprint 0.1: App rename

**Ready to kick off Phase 0?**
