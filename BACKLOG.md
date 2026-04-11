# Multiplication Kingdom — Product Backlog

## Overview
Prioritized list of features, improvements, and fixes for the educational multiplication game.

---

## Recently Completed ✅

### Infrastructure & Deployment (Current Session)
- [x] **Migrate to Firebase Hosting** — Moved from Render Static Site → Web Service → Firebase Hosting for better SPA routing and instant loads (no cold starts)
- [x] **Enable SPA Routing on Firebase** — Added rewrites in firebase.json to serve index.html for all routes
- [x] **Express Server for Render** — Created server.cjs (CommonJS) for SPA routing during Render Web Service hosting (still available if needed)
- [x] **Setup GitHub Actions for Firebase** — Configured automatic deployments to Firebase Hosting on every push to main branch

### Bug Fixes (Previous Session)
- [x] **Fix HomeScreen Double User Display** — Removed duplicate "guest" and logged-in user labels showing simultaneously on Home Page (added !guest condition)
- [x] **Incognito/Private Browsing Support** — Implemented three-layer storage fallback (localStorage → sessionStorage → in-memory flag) to handle storage unavailability in private/incognito modes
- [x] **Preserve Redirect Destination After Auth** — Fixed redirect flow to forward users to their intended destination after guest mode or login (e.g., navigate to /number-cruncher/play first, then auth, then land on Number Cruncher)
- [x] **Single-Click Guest Mode** — Replaced polling interval-based detection with custom event system ('guestModeChanged') for instant guest mode state updates
- [x] **Form Accessibility** — Added autocomplete attributes to all form fields (email, username, new-password, current-password) to eliminate browser validation warnings
- [x] **Number Cruncher Keystroke Validation** — Changed game to evaluate input after each keystroke instead of requiring Enter key press; incorrect digit ends game instantly; correct sequence advances to next number

### User-Requested Features
- [x] **Add Username to Authentication** — Modify signup to collect email, username, and password; store and display username on Home Page and Leaderboard instead of email
- [x] **Privacy Policy Notice on Signup** — Add brief statement on signup page: "We will never sell or share your information" with link to PRIVACY_POLICY.md
- [x] **Hide Training Game from Homepage** — Remove Training card from Home Page while preserving all source code and routes for future re-enable
- [x] **Interactive Mult Table Quick Access** — Add button/link to top-right corner of Home Page and all Game Home Pages; back arrow on table should return to originating page (not fixed TrainingMenu route)
- [x] **Touch/Drag Support for Interactive Mult Table** — Implemented touch gesture support (tap + drag) for touchscreen devices; highlights follow finger in real-time during drag and persist after lifting until user taps elsewhere
- [x] **Remove Flashcard Challenge from Conquest** — Removed Flashcard Practice button from kingdom selection; landing on kingdom goes directly to Speed Challenge
- [x] **Fix Interactive Mult Table Icon Overlap** — Moved 📊 icon up and right (top: -12px, right: -12px) so it doesn't cover "Kingdom" text in headers
- [x] **Keep Mobile Keypad Visible in Flashcard Challenge** — Fixed input form to always stay in DOM (disabled during feedback) instead of unmounting, preserving onscreen keyboard between questions
- [x] **Consistent Back Icon Throughout App** — Standardized all back buttons to use `‹` icon with circular 40×40px design; updated all components and removed redundant CSS classes (tm-back-btn, tt-back-btn, lb-back)
- [x] **Back Button Origin Tracking** — Updated KingdomSiege and other games to track origin from navigation state; back buttons now navigate to previous screen instead of hardcoded routes
- [x] **Remove Home Button from Flashcard Results** — Removed "Home" button from Flashcard Challenge's Play Again screen; added back icon button in top-left corner instead
- [x] **Mobile & Desktop UX Polish** — Fixed back icon alignment consistency, adjusted mult table icon positioning, added Quit buttons to Kingdom Siege and SpeedChallenge, skip KingdomScreen during Conquest (direct to Speed Challenge), fixed Flashcard keypad hiding on wrong answers, made topbar sticky, reduced question card height for better mobile screen space

### Spelling Word Manager (NEW FEATURE - COMPLETED)
- [x] **Spelling Word Admin Panel** — Create teacher-only interface for managing word groups with password protection (teacher123); CRUD operations (create, read, archive, delete, restore) with Firestore integration
- [x] **Sentence Generation (Template-Based)** — Auto-generate learning-focused sentences for spelling words using 15 universal templates as fallback
- [x] **AI-Powered Sentence Generation** — Integrate Google Gemini API for contextual, meaning-focused sentences; verified working with test words (should, sing, sister, concert); produces age-appropriate, pedagogically sound sentences
- [x] **Firebase Deployment** — Deploy AI integration to Firebase Hosting; add .env file for build-time environment variables

### Infrastructure & Tooling (Suggested)
- [x] **Firestore Security Rules** — Created comprehensive Firestore rules allowing authenticated users to write scores and read usernames for signup validation
- [x] **Clear Leaderboard Utility** — Built script (`scripts/clearLeaderboard.js`) to clear leaderboard from Firestore for testing; includes setup documentation
- [x] **Firebase Deployment Config** — Created `.firebaserc`, `firebase.json`, and `firestore.indexes.json` for streamlined Firebase deployment

---

## Near-Term / In Progress

### User-Requested
- [x] **Sound Effects** — Audio feedback system implemented with mute button in FlashcardGame and SpeedChallenge. Ready for audio files: download MP3s from free sources (Freesound, Zapsplat, Pixabay), place in public/sounds/, and integrate into remaining game modes (MatchGame, KingdomSiege, Flashcard Mode in Conquest)
- [ ] **Create Teacher Dashboard** — Build admin interface for classroom management: view class progress, assign kingdoms, track student completion

### Suggested
- [ ] **API Key Security Hardening** — Gemini API key is currently committed to .env for Firebase build access. Recommended: Add API restrictions in Google Cloud Console (limit to Generative Language API only) and Application restrictions (limit to Firebase domain only). Consider future refactor to use secure environment management (e.g., Firebase Secrets, Cloud Functions middleware). For classroom use, current setup is acceptable with usage monitoring.


---

## High Priority

### Training Modes
- [ ] **Skip Counting Mode** — Count by multiples (5, 10, 7, etc.) with visual guides
- [ ] **Factor Pairs** — Identify factors and factor pairs interactively
- [ ] **Division Drill** — Reverse multiplication: "24 ÷ 6 = ?" learning mode
- [ ] **Multiplication Grid Quiz** — Timed quiz version of the interactive table

### UI/UX Improvements

#### User-Requested
(None currently)

#### Suggested
- [ ] **Achievements/Badges** — Unlock badges for milestones (e.g., "Master of 7s", "Speed Demon")
- [ ] **Progress Dashboard** — Student view showing strengths/weaknesses by kingdom
- [ ] **Difficulty Selection** — Let students choose: Easy, Medium, Hard before kingdom
- [ ] **Keyboard Controls** — Allow number keys (1-12) + Enter for faster input in games

### Mobile/Accessibility

#### User-Requested
(None currently)

#### Suggested
- [ ] **Touch Optimization** — Better button sizes and spacing for mobile
- [ ] **Dark Mode** — Add dark theme toggle for accessibility
- [ ] **Keyboard Navigation** — Full keyboard support (Tab, Space, Arrow keys)
- [ ] **Screen Reader Support** — Improve ARIA labels for accessibility

---

## Medium Priority

### Leaderboard Enhancements

#### User-Requested
(None currently)

#### Suggested
- [ ] **Time-based Leaderboard** — Fastest times for each game mode
- [ ] **School/Class View** — Filter leaderboard by class or school
- [ ] **Personal Stats** — Show improvement over time
- [ ] **Challenge Friends** — Create shareable challenges between users

### Game Improvements

#### User-Requested
(None currently)

#### Suggested
- [ ] **Kingdom Unlock Customization** — Allow students to unlock all kingdoms immediately (opt-in)
- [ ] **Hint System** — Show hints for struggling students (e.g., visual aids, countdown)
- [ ] **Multiplayer Mode** — Real-time competitive multiplayer for same device
- [ ] **Story/Narrative** — Add lore to kingdoms for better engagement

### Teacher/Admin Features

#### User-Requested
(None currently)

#### Suggested
- [ ] **Teacher Dashboard** — View class progress, assign kingdoms, track completion
- [ ] **Student Profiles** — Account creation for classroom use
- [ ] **Reporting** — Export progress reports as PDF
- [ ] **Class Management** — Create classes, invite students, bulk actions

---

## Low Priority

### Nice-to-Have Features

#### User-Requested
(None currently)

#### Suggested
- [ ] **Custom Multiplier Ranges** — "Practice 11-13 tables" instead of 1-12
- [ ] **Flashcard Decks** — Create/share custom flashcard sets
- [ ] **Daily Challenges** — Time-limited daily multiplication puzzles
- [ ] **Offline Mode** — Full offline support with sync when reconnected
- [ ] **Print Worksheets** — Generate printable multiplication practice sheets

### Analytics & Monitoring

#### User-Requested
(None currently)

#### Suggested
- [ ] **Usage Analytics** — Track feature usage, session duration, completion rates
- [ ] **Error Tracking** — Sentry integration for bug monitoring
- [ ] **Performance Monitoring** — Track app load time and responsiveness
- [ ] **User Feedback** — In-app feedback survey/collection

### Android App

#### User-Requested
(None currently)

#### Suggested
- [ ] **Push Notifications** — Remind users to play daily
- [ ] **App Store Optimization** — Improve Google Play Store listing
- [ ] **Offline Sync** — Better offline handling with background sync
- [ ] **iOS Support** — Add iOS build via Capacitor

---

## Bugs / Technical Debt

#### User-Requested
(None currently)

#### Suggested
- [ ] **Firebase Credentials Setup** — To use new Firebase credentials, create `.env.local` based on `.env.example` with values from your Firebase Console
- [ ] **Fix Git Lock Issue** — Investigate why `.git/index.lock` persists
- [ ] **Error Boundaries** — Add React error boundary components to prevent white screens
- [ ] **Performance** — Optimize large multiplayer games, reduce re-renders
- [ ] **Unit Tests** — Add Jest tests for core game logic (score calculations, validations)
- [ ] **E2E Tests** — Cypress/Playwright tests for user flows

---

## Future Exploration

#### User-Requested
(None currently)

#### Suggested
- [ ] **AI Tutor** — Personalized learning paths based on student performance
- [ ] **Multiplication Concepts** — Teach "why" multiplication works (area models, groups)
- [ ] **Chinese Remainder Theorem** — Advanced mode for older students
- [ ] **Gamification** — Level system, XP, skill trees
- [ ] **Video Tutorials** — Embedded educational videos for each kingdom

---

## Notes

- **Prioritization** is based on educational impact and user engagement
- **Teacher Features** are Medium priority pending user research with educators
- **Multiplayer** features pending server infrastructure decisions
- Backlog items may change based on user feedback and deployment metrics
