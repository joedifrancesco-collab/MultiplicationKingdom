# App Settings Configuration

**Phase 0 Sprint 0.3: Parametrized Game Configuration**

---

## Overview

`appsettings.json` is the centralized configuration file for all Learning Kingdom games. It defines:
- Game parameters (time limits, scoring, difficulty)
- Theme and UI settings
- Audio configuration
- Platform compatibility flags
- Authentication settings
- Leaderboard behavior

All values are **editable in one place** without code changes.

---

## File Locations

| File | Purpose |
|------|---------|
| `src/config/appsettings.json` | Settings data (JSON) |
| `src/config/appSettings.js` | Settings API (JavaScript) |

---

## Schema

### Top-Level Sections

```json
{
  "app": { ... },              // App metadata
  "theme": { ... },            // Color palette & UI
  "difficulty": { ... },       // Difficulty levels
  "games": { ... },            // Per-game settings
  "audio": { ... },            // Sound effects config
  "ui": { ... },               // UI animations
  "leaderboard": { ... },      // Leaderboard behavior
  "auth": { ... },             // Authentication
  "logging": { ... }           // Debug logging
}
```

### Key Sections

#### `app`
```json
{
  "name": "Learning Kingdom",
  "version": "0.0.1",
  "environment": "development"
}
```

#### `theme`
```json
{
  "primary": "#6C63FF",
  "secondary": "#FF6B6B",
  "success": "#6BCB77",
  "accent": "#FFD93D",
  "background": "#F0F4FF",
  "borderRadius": "16px"
}
```

#### `difficulty`
```json
{
  "levels": {
    "easy": 1,
    "medium": 2,
    "hard": 3
  },
  "default": "medium"
}
```

#### `games.*` (Per-Game Settings)

Each game under `games` has this structure:

```json
{
  "enabled": true,
  "platforms": "both",
  "defaultDifficulty": "medium",
  "timeLimits": { ... },
  "scoring": { ... }
}
```

**Example: Multiplication Flashcard**
```json
{
  "multiplicationFlashcard": {
    "enabled": true,
    "platforms": "both",
    "defaultDifficulty": "medium",
    "timeLimits": {
      "timed": 60,
      "sprint": 30,
      "practice": null
    },
    "scoring": {
      "pointsPerCorrect": 10,
      "penaltyPerWrong": 5,
      "bonusTimeBonus": 1.2
    }
  }
}
```

#### `audio`
```json
{
  "enabled": true,
  "defaultVolume": 0.5,
  "sounds": {
    "correct": {
      "enabled": true,
      "frequency": 800,
      "duration": 200
    },
    "incorrect": { ... },
    "levelUp": { ... },
    "gameOver": { ... }
  }
}
```

#### `leaderboard`
```json
{
  "enabled": true,
  "maxEntries": 100,
  "showGlobalStats": false,
  "guestScoresSaved": true
}
```

#### `auth`
```json
{
  "guestModeEnabled": true,
  "requireSignUpOnExit": true,
  "sessionTimeout": null
}
```

---

## Usage in Components

### 1. Import the API

```jsx
import { getSetting, isGameEnabled, getGamePlatforms } from '../config/appSettings';
```

### 2. Get Settings with Dot Notation

```jsx
// Global setting
const primaryColor = getSetting('theme.primary');

// Game-specific setting
const flashcardTimedLimit = getSetting('games.multiplicationFlashcard.timeLimits.timed');

// With fallback
const volume = getSetting('audio.defaultVolume', 0.5);
```

### 3. Check Game Status

```jsx
// Is this game enabled?
if (isGameEnabled('spelling')) {
  // Show spelling game
}

// What platforms does this game support?
const platforms = getGamePlatforms('kingdomSiege');
if (platforms === 'both' || platforms === 'desktop') {
  // Show on desktop
}
```

### 4. Use in Component

```jsx
import { useState, useEffect } from 'react';
import { getSetting } from '../config/appSettings';

export default function SpeedChallenge() {
  const timeLimit = getSetting('games.speedChallenge.timeLimits.default', 45);
  const pointsPerCorrect = getSetting('games.speedChallenge.scoring.pointsPerCorrect', 10);
  
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [score, setScore] = useState(0);
  
  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Scoring
  function handleCorrect() {
    setScore(s => s + pointsPerCorrect);
  }
  
  return (
    <div>
      <div>Time: {timeLeft}s</div>
      <div>Score: {score}</div>
      <button onClick={handleCorrect}>Answer</button>
    </div>
  );
}
```

---

## Common Tasks

### Change a Game's Time Limit

**Before:** Hardcoded in the component
```jsx
const timeLimit = 60; // ❌ Hardcoded
```

**After:** In appsettings.json
```json
{
  "games": {
    "multiplicationFlashcard": {
      "timeLimits": {
        "timed": 120  // ✅ Changed here, component auto-updates
      }
    }
  }
}
```

Component automatically uses the new value on next reload.

### Disable a Game

Edit appsettings.json:
```json
{
  "games": {
    "kingdomSiege": {
      "enabled": false  // Hides from menus
    }
  }
}
```

Component checks:
```jsx
if (isGameEnabled('kingdomSiege')) {
  // Won't render if disabled
}
```

### Set Game to Desktop-Only

```json
{
  "games": {
    "kingdomSiege": {
      "platforms": "desktop"  // Hidden on mobile
    }
  }
}
```

Component checks:
```jsx
const platforms = getGamePlatforms('kingdomSiege');
if (platforms === 'mobile') {
  return <div>Not playable on this device</div>;
}
```

### Override Settings Programmatically (Session-Only)

```jsx
import { overrideSetting } from '../config/appSettings';

// Temporarily disable audio for this session
overrideSetting('audio.enabled', false);

// Admin sets custom time limit during game
overrideSetting('games.speedChallenge.timeLimits.default', 90);
```

Settings reset on app reload (not persisted).

---

## API Reference

### `getSettings()`
Returns a copy of all current settings.
```jsx
const all = getSettings();
console.log(all.theme.primary); // "#6C63FF"
```

### `getSetting(path, defaultValue)`
Get a specific setting by dot-notation path.
```jsx
const limit = getSetting('games.spellingPractice.timeLimits.timed', 60);
```

### `overrideSetting(path, value)`
Override a setting for the current session (not persisted).
```jsx
overrideSetting('audio.defaultVolume', 0.8);
```

### `resetSettings()`
Reset all settings to defaults, clearing overrides.
```jsx
resetSettings();
```

### `isGameEnabled(gameKey)`
Check if a game is enabled.
```jsx
if (!isGameEnabled('kingdomSiege')) {
  // Don't show this game
}
```

### `getGamePlatforms(gameKey)`
Get platform compatibility ("desktop", "mobile", or "both").
```jsx
const platforms = getGamePlatforms('spelling');
```

### `validateSettings()`
Validate settings on app startup. Logs warnings if issues found.
```jsx
// Call in App.jsx on boot
if (!validateSettings()) {
  console.error('Settings are invalid!');
}
```

### `getAppMetadata()`
Get app name, version, environment.
```jsx
const meta = getAppMetadata();
console.log(meta.name, meta.version); // "Learning Kingdom", "0.0.1"
```

### `getEnabledGames()`
Get all enabled games with their config.
```jsx
const games = getEnabledGames();
// { 
//   multiplicationFlashcard: { enabled: true, ... },
//   spelling: { enabled: true, ... },
//   ...
// }
```

---

## Integration Checklist (Phase 3+)

When integrating appsettings into components:

- [ ] Replace all hardcoded time limits with `getSetting('games.*.timeLimits.*')`
- [ ] Replace hardcoded scoring with `getSetting('games.*.scoring.*')`
- [ ] Replace hardcoded colors with `getSetting('theme.*')`
- [ ] Check `isGameEnabled()` before rendering games
- [ ] Check `getGamePlatforms()` for device compatibility
- [ ] Call `validateSettings()` in `App.jsx` on startup
- [ ] Test overrides work for admin/testing purposes
- [ ] Document any new settings added to appsettings.json

---

## Future Enhancements

### Admin Panel
Create a UI to edit appsettings.json without code changes:
```jsx
// Phase 6+?
<SettingsAdmin 
  onSave={(newSettings) => {
    // POST to backend or save to localStorage
  }}
/>
```

### Multi-Environment Support
Add staging/production settings:
```json
{
  "_comment": "Future: environments/production.json, environments/staging.json",
  "environment": "production"
}
```

### Per-User Overrides
Store user-specific difficulty adjustments:
```
user.userId = "abc123"
user.overrides = {
  "games.speedChallenge.difficulty": "easy"
}
```

---

## Schema Validation (Optional)

To add schema validation in the future:

```js
// src/config/appSettings.schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["app", "games", "theme"],
  "properties": {
    "app": { "type": "object" },
    "games": { "type": "object" }
  }
}
```

Then validate on load:
```js
import Ajv from 'ajv';
import schema from './appSettings.schema.json';
const ajv = new Ajv();
const valid = ajv.validate(schema, settings);
```

---

## File: `src/config/appsettings.json`

See the actual settings file for all game configurations.
