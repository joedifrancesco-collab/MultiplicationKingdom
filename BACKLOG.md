# Multiplication Kingdom — Product Backlog

## Overview
Prioritized list of features, improvements, and fixes for the educational multiplication game.

---

## Recently Completed ✅

### User-Requested Features
- [x] **Add Username to Authentication** — Modify signup to collect email, username, and password; store and display username on Home Page and Leaderboard instead of email
- [x] **Privacy Policy Notice on Signup** — Add brief statement on signup page: "We will never sell or share your information" with link to PRIVACY_POLICY.md
- [x] **Hide Training Game from Homepage** — Remove Training card from Home Page while preserving all source code and routes for future re-enable
- [x] **Interactive Mult Table Quick Access** — Add button/link to top-right corner of Home Page and all Game Home Pages; back arrow on table should return to originating page (not fixed TrainingMenu route)

### Infrastructure & Tooling (Suggested)
- [x] **Firestore Security Rules** — Created comprehensive Firestore rules allowing authenticated users to write scores and read usernames for signup validation
- [x] **Clear Leaderboard Utility** — Built script (`scripts/clearLeaderboard.js`) to clear leaderboard from Firestore for testing; includes setup documentation
- [x] **Firebase Deployment Config** — Created `.firebaserc`, `firebase.json`, and `firestore.indexes.json` for streamlined Firebase deployment

---

## Near-Term / In Progress

### User-Requested
- [ ] **Touch/Drag Support for Interactive Mult Table** — Research and implement touch gesture support (tap + drag) for touchscreen devices to match mouse hover experience; user should be able to drag finger across table to see X/Y coordinates and highlights
- [ ] **Create Teacher Dashboard** — Build admin interface for classroom management: view class progress, assign kingdoms, track student completion

### Suggested
- [ ] **Rework Interactive Multiplication Table** — Improve UX, consider additional features or refinements
- [x] **Hide Training Game from Homepage** — Remove Training card from Home Page while preserving all source code and routes for future re-enable
- [x] **Interactive Mult Table Quick Access** — Add button/link to top-right corner of Home Page and all Game Home Pages; back arrow on table should return to originating page (not fixed TrainingMenu route)

---

## High Priority

### Training Modes
- [ ] **Skip Counting Mode** — Count by multiples (5, 10, 7, etc.) with visual guides
- [ ] **Factor Pairs** — Identify factors and factor pairs interactively
- [ ] **Division Drill** — Reverse multiplication: "24 ÷ 6 = ?" learning mode
- [ ] **Multiplication Grid Quiz** — Timed quiz version of the interactive table

### UI/UX Improvements

#### User-Requested
- [ ] **Sound Effects** — Add audio feedback for correct/incorrect answers, level completion, and other key game events

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
