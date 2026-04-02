# Multiplication Kingdom — Terminology & Naming Convention

## Core App Terminology

Use these terms consistently throughout documentation, code comments, and discussions.

### Pages & Screens

| Term | Definition | Example |
|------|-----------|---------|
| **Login Page** | Authentication screen where users enter email/password | `/auth` route, AuthScreen component |
| **Home Page** | First page displayed after successful login | `/` route, HomeScreen component |
| **Game** | A major game mode available on the Home Page | Conquest, Flashcard Challenge, Kingdom Siege, Training |
| **Game Home Page** | The page displayed after user selects a Game (navigation/overview page) | KingdomMap (Conquest), FlashcardMenu, TrainingMenu |
| **Subgame** | Individual playable challenges within a Game Home Page | Flashcard, Speed Challenge, Match Game (Conquest subgames) |
| **Game Page** | The actual playable game where user completes challenges | FlashcardGame, SpeedChallenge, MatchGame components |

### Game-Specific Examples

#### Conquest (Kingdom) Game
- **Game:** Conquest
- **Game Home Page:** KingdomMap (shows all 12 kingdoms)
- **Subgame:** Individual kingdom (e.g., "Kingdom 1: Times Tables of 1")
- **Game Page:** Flashcard, Speed Challenge, or Match Game for that kingdom

#### Flashcard Challenge Game
- **Game:** Flashcard Challenge
- **Game Home Page:** FlashcardMenu (shows difficulty options: Normal, Race, Sprint)
- **Subgame:** Each difficulty mode
- **Game Page:** FlashcardGame component (the actual card-flipping game)

#### Training Game
- **Game:** Training
- **Game Home Page:** TrainingMenu (shows training options)
- **Subgame:** Interactive Multiplication Table
- **Game Page:** TrainingTable component (the interactive table page)

#### Kingdom Siege Game
- **Game:** Kingdom Siege
- **Game Home Page:** None (KingdomSiege is directly playable)
- **Subgame:** N/A
- **Game Page:** KingdomSiege component

### Other Key Terms

| Term | Definition |
|------|-----------|
| **Leaderboard** | Global score display showing top players across all games |
| **Player** | An authenticated user account |
| **Score** | Points earned from completing games (varies by game type) |
| **Stars** | Achievement indicator for Conquest kingdoms (1-3 stars per kingdom) |
| **Kingdom** | A times table group in the Conquest game (1 kingdom = 1 times table: ×1 through ×12) |

### Component Naming

Follow this pattern when naming new components:

```
<GameName><ComponentPurpose>.jsx
```

**Examples:**
- `FlashcardGame.jsx` — the playable game page
- `FlashcardMenu.jsx` — the game home page
- `SpeedChallenge.jsx` — a subgame/game page
- `KingdomMap.jsx` — a game home page
- `TrainingMenu.jsx` — a game home page

### File & Folder Structure

```
src/
  components/
    [GameName][Purpose].jsx
    [GameName][Purpose].css
    
  data/
    questions.js
    
  store/
    progress.js
    
  config/
    firebase.js
    
  utils/
    contentFilter.js
```

## Quick Reference

**User Journey:**
1. User loads app → sees **Login Page**
2. User logs in → redirected to **Home Page**
3. User selects a **Game** (e.g., "Conquest") → navigates to **Game Home Page**
4. User selects a **Subgame** (e.g., "Kingdom 3") → navigates to **Game Page**
5. User completes game → score saved, returns to **Game Home Page**

## When to Use Which Term

**In Code Comments:**
```javascript
// ✅ Correct
// Load all subgames for this game
const subgames = getSubgamesForKingdom(kingdomId);

// ❌ Avoid
// Load all games for this game
const games = getGamesForGame(gameId);
```

**In Documentation:**
```markdown
# How to Create a New Game

1. Create a Game Home Page component (e.g., MyGameMenu.jsx)
2. Create Subgame pages (e.g., MyGameSubgame1.jsx)
3. Create the Game Page (e.g., MyGamePlay.jsx)
4. Add routes in App.jsx
```

**In Discussions:**
```
❌ "The game page shows all the games"
✅ "The Home Page shows all available Games"

❌ "I'm working on the training game's game page"
✅ "I'm working on the TrainingTable game page"

❌ "Each kingdom is a game"
✅ "Each kingdom is a subgame within the Conquest game"
```

---

## Notes

- This terminology should be used in PRs, commit messages, and code documentation
- When adding new games, follow this naming pattern consistently
- Update this guide if new terms are needed
