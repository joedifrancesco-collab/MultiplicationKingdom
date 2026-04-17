# Learning Kingdom — Codebase Structure Specification

This document defines the authoritative structure of the app to prevent inconsistencies between components.

## 🎮 Game Entry Points (Home Screen Cards)

These are the 4 main "games" shown on the home page (`HomeScreen.jsx`). **ALL** navigation menus and routes must align with this.

| Card | Icon | Route | Component | Submenu Items |
|------|------|-------|-----------|---|
| **Conquest** | 🏰 | `/subjects/math-kingdom/multiplication-kingdom/grid` | `KingdomMap` | Speed Challenge, Match Game |
| **Flashcard Challenge** | 🃏 | `/subjects/math-kingdom/multiplication-kingdom/flashcards` | `FlashcardMenu` | Practice, Timed, Sprint |
| **Kingdom Maps** | 🗺️ | `/subjects/math-kingdom/multiplication-kingdom/maps` | `KingdomMapsMode` | Free Play, Timed, Row & Column |
| **Kingdom Siege** | ⚔️ | `/subjects/math-kingdom/multiplication-kingdom/siege` | `KingdomSiege` | *(No submenu - it's a single game)* |

---

## 📍 Navigation Menu Structure

### Primary Navigation (Top Bar)

**Math Dropdown → Multiplication Kingdom Submenu:**

When user hovers over "Math" and clicks "Multiplication Kingdom", the submenu should show **quick-access links to the 4 main games** (matching the home page cards):

```
Math ▼
├── Multiplication Kingdom →
│   ├── 🏰 Conquest (/grid)
│   ├── 🃏 Flashcard Challenge (/flashcards)
│   ├── 🗺️ Kingdom Maps (/maps)
│   └── ⚔️ Kingdom Siege (/siege)
├── Addition Kingdom 🔒
└── ...
```

This configuration is in `ResponsiveNav.jsx` (lines 62-69).

---

## 🎯 Game Modes (Internal Structure)

Each main game has internal **modes** or **game types**. These are shown AFTER clicking a game entry point:

### Conquest Game Modes
Shown in `MultiplicationKingdomHome.jsx` card buttons:
- **Conquest** (Grid mode - select a kingdom)
- **Flashcard Challenge** 
- **Kingdom Maps** (Grid game)
- **Kingdom Siege** (Tower defense)

### Flashcard Challenge Modes
Shown in `FlashcardMenu.jsx`:
- **Practice** (untimed, endless)
- **Timed** (1, 3, or 5 minutes)
- **Sprint** (30 seconds)

### Kingdom Maps Modes
Shown in `KingdomMapsMode.jsx`:
- **Free Play** (untimed)
- **Timed Challenge** (race the clock)
- **Row & Column** (find errors)

### Kingdom Siege
- No submenu (single playable game)

---

## 🗂️ Route Hierarchy

```
/subjects/math-kingdom/multiplication-kingdom/        ← MultiplicationKingdomHome (4 game cards)
  ├── conquest/                                        ← Conquest mode selector (12 kingdoms)
  │   └── :id/
  │       ├── flashcard                              ← Flashcard mode for kingdom
  │       ├── speed                                   ← Speed challenge for kingdom
  │       ├── match                                   ← Match game for kingdom
  │       └── siege                                   ← Siege mode for kingdom
  │
  ├── flashcards/                                     ← FlashcardMenu (mode selector)
  │   └── play                                        ← FlashcardGame (actual game)
  │
  ├── kingdom-maps/                                   ← KingdomMapsMode (mode selector)
  │   └── :mode/                                      ← KingdomMaps (actual game)
  │
  └── siege/                                          ← KingdomSiege (directly playable)

/subjects/math-kingdom/multiplication-kingdom/training/table  ← TrainingTable (Times Table)
```

---

## 🐛 Known Bugs to Fix

### Bug #1: Nav Submenu Shows Wrong Items
**Status:** ✅ FIXED (April 16)

**Location:** `ResponsiveNav.jsx` → Math dropdown → Multiplication Kingdom submenu (lines 62-69)

**Previous (Wrong):**
```
🎮 Flashcard → /subjects/math-kingdom/multiplication-kingdom/1/flashcard
⚡ Speed Challenge → /subjects/math-kingdom/multiplication-kingdom/1/speed
🔀 Match Game → /subjects/math-kingdom/multiplication-kingdom/1/match
⚔️ Kingdom Siege → /subjects/math-kingdom/multiplication-kingdom/1/siege
```
*(These were kingdom-specific game modes, not the 4 main games)*

**Now (Correct):**
```
🏰 Conquest → /subjects/math-kingdom/multiplication-kingdom/grid
🃏 Flashcard Challenge → /subjects/math-kingdom/multiplication-kingdom/flashcards
🗺️ Kingdom Maps → /subjects/math-kingdom/multiplication-kingdom/maps
⚔️ Kingdom Siege → /subjects/math-kingdom/multiplication-kingdom/siege
```
*(These match the 4 game cards on the home page)*

---

### Bug #2: Breadcrumb Doesn't Show Game Mode
**Status:** ✅ FIXED (April 16)

Breadcrumbs now show full path including game mode (e.g., "Home > Math-kingdom > Multiplication Kingdom > Flashcard Challenge > 1 Minute")

---

## 📋 Component Mapping

| Component | Purpose | Entry Route |
|-----------|---------|-------------|
| `MultiplicationKingdomHome` | Shows 4 game cards | `/subjects/math-kingdom/multiplication-kingdom` |
| `FlashcardMenu` | Shows 3 practice modes | `/subjects/math-kingdom/multiplication-kingdom/flashcards` |
| `FlashcardGame` | Actual flashcard game | `/subjects/math-kingdom/multiplication-kingdom/flashcards/play` |
| `KingdomMapsMode` | Shows 3 Kingdom Maps modes | `/subjects/math-kingdom/multiplication-kingdom/kingdom-maps` |
| `KingdomMaps` | Actual maps game | `/subjects/math-kingdom/multiplication-kingdom/kingdom-maps/:mode` |
| `KingdomSiege` | Tower defense game | `/subjects/math-kingdom/multiplication-kingdom/siege` |
| `TrainingTable` | Times table reference | `/subjects/math-kingdom/multiplication-kingdom/training/table` |
| `NavigationMenu` (Breadcrumb) | Shows current path | All routes |

---

## ✅ Verification Checklist

Before merging changes, verify:

- [ ] All 4 home screen game cards are present and functional
- [ ] Nav menu "Math > Multiplication Kingdom" submenu shows all 4 games
- [ ] Each game's internal modes are correct (not showing wrong items)
- [ ] Breadcrumb trail extends to game mode (e.g., "1 Minute")
- [ ] All routes follow the `/subjects/[subject]/[kingdom]/[game]/[mode]` pattern
- [ ] No duplicate/conflicting routes in `App.jsx`
- [ ] No orphaned components with no route

---

## 🔧 Configuration for NavDropdown

**File:** `src/shared/components/ResponsiveNav.jsx` (lines 62-69)

The submenu items are defined in the `mathSubject` object:

```javascript
const mathSubject = {
  key: 'math',
  icon: '🔢',
  label: 'Math',
  path: '/subjects/math',
  items: [
    {
      icon: '✖️',
      label: 'Multiplication Kingdom',
      path: '/subjects/math-kingdom/multiplication-kingdom',
      items: [
        { label: '🏰 Conquest', path: '/subjects/math-kingdom/multiplication-kingdom/grid' },
        { label: '🃏 Flashcard Challenge', path: '/subjects/math-kingdom/multiplication-kingdom/flashcards' },
        { label: '🗺️ Kingdom Maps', path: '/subjects/math-kingdom/multiplication-kingdom/maps' },
        { label: '⚔️ Kingdom Siege', path: '/subjects/math-kingdom/multiplication-kingdom/siege' },
      ],
    },
    // ... other kingdoms
  ],
};
```

---

## 📊 Quick Reference: URL → Component Mapping

| URL | Component | Shows | Pages To |
|-----|-----------|-------|----------|
| `/subjects/math-kingdom/multiplication-kingdom` | `MultiplicationKingdomHome` | 4 game choice cards | Any game |
| `/subjects/math-kingdom/multiplication-kingdom/flashcards` | `FlashcardMenu` | 3 mode buttons | FlashcardGame (/play) |
| `/subjects/math-kingdom/multiplication-kingdom/kingdom-maps` | `KingdomMapsMode` | 3 mode buttons | KingdomMaps (/freePlay, /timed, /rowColumn) |
| `/subjects/math-kingdom/multiplication-kingdom/siege` | `KingdomSiege` | Game board (no menu) | Game itself (directly playable) |
| `/subjects/math-kingdom/multiplication-kingdom/training/table` | `TrainingTable` | Times table grid | Reference only |
| `/subjects/math-kingdom/multiplication-kingdom/conquest` | `KingdomMap` | 12 kingdom selection | Individual Kingdom (/1, /2, etc.) |

