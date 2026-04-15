# useGameLoop Hook — Refactoring Guide

**Location:** `src/shared/hooks/useGameLoop.js`  
**Status:** Created in Phase 2 Sprint 2.1  
**Components Using It:** SpeedChallenge ✅

---

## Purpose

Abstract the common game flow pattern used by sequential question-answer games:
1. Load questions
2. Present current question
3. Collect user input
4. Validate answer
5. Play sound feedback
6. Update score
7. Auto-advance or wait for manual advance
8. Show results when done

## Hook Signature

```javascript
const gameLoop = useGameLoop({
  questions: Array,                    // Array of question objects
  validateAnswer: Function,            // (question, userAnswer) => boolean
  calcStars: Function,                 // (score, total) => 0-3
  gameType: String,                    // 'speed', 'flashcard', 'match', etc.
  metadata: Object,                    // { kingdomId, kingdomName, ... }
  autoAdvance: Boolean = false,        // Auto move to next after validation
  advanceDelay: Number = 400,          // Delay before auto-advance (ms)
  onGameEnd: Function = null,          // Callback when game completes
});
```

## Returned State & Methods

### State Properties
- `index` — Current question index
- `currentQuestion` — Current question object
- `score` — Number of correct answers
- `feedback` — 'correct' | 'wrong' | null
- `done` — Game completed flag
- `earnedStars` — 0-3 stars earned
- `soundMuted` — Mute state
- `progress` — Percentage (0-100)
- `total` — Total questions
- `isComplete` — Alias for `done`
- `isLastQuestion` — Boolean

### Methods
- `submitAnswer(userAnswer, onCorrect?, onWrong?)` — Submit ans wer and advance if autoAdvance=true
- `advanceToNext()` — Manually move to next question
- `endGameNow()` — End game immediately
- `toggleMute()` — Toggle sound mute

## Examples

### SpeedChallenge Pattern (Implemented ✅)

```javascript
const gameLoop = useGameLoop({
  questions: shuffled,
  validateAnswer: (q, answer) => parseInt(answer, 10) === q.answer,
  calcStars: (score, total) => {
    const pct = (score / total) * 100;
    if (pct >= 90) return 3;
    if (pct >= 60) return 2;
    if (pct >= 30) return 1;
    return 0;
  },
  gameType: 'speed',
  metadata: { kingdomId, kingdomName: KINGDOMS[kingdomId - 1].name },
  autoAdvance: true,
  advanceDelay: 400,
});

// In handleSubmit:
function handleSubmit(e) {
  e.preventDefault();
  gameLoop.submitAnswer(input);
  setInput('');
}

// Timer uses endGameNow:
useEffect(() => {
  if (gameLoop.done) return;
  const timer = setInterval(() => {
    setTimeLeft(t => {
      if (t <= 1) gameLoop.endGameNow();
      return Math.max(0, t - 1);
    });
  }, 1000);
  return () => clearInterval(timer);
}, [gameLoop.done]);

// Render:
<h2>Score: {gameLoop.score}</h2>
<p className={gameLoop.feedback}>{gameLoop.currentQuestion.question} = ?</p>
```

### FlashcardGame Pattern (NOT YET - Different Logic)

**Note:** FlashcardGame is NOT a good fit for this hook because:
- Supports unlimited questions (not fixed length)
- Multiple game modes with different logic
- Complex keyboard/focus management
- Would require major hook redesign

**Status:** Keep current implementation OR refactor separately.

### SpellingPractice Pattern (TODO - Good Fit)

Similar to SpeedChallenge:
- Fixed set of words
- Sequential presentation
- User types answer
- Validation: string match
- Auto-advance after feedback

## Implementation Steps for New Components

1. **Extract question validation:**
   ```javascript
   validateAnswer: (question, userAnswer) => {
     // Component-specific logic here
   }
   ```

2. **Define star calculation:**
   ```javascript
   calcStars: (score, total) => {
     const pct = (score / total) * 100;
     // Return 0-3 based on percentage
   }
   ```

3. **Initialize hook:**
   ```javascript
   const gameLoop = useGameLoop({
     questions, validateAnswer, calcStars,
     gameType, metadata,
     autoAdvance, advanceDelay,
   });
   ```

4. **Replace state references:**
   - `index` → `gameLoop.index`
   - `score` → `gameLoop.score`
   - `feedback` → `gameLoop.feedback`
   - `done` → `gameLoop.done`
   - `earnedStars` → `gameLoop.earnedStars`
   - etc.

5. **Replace event handlers:**
   - `handleSubmit()` → `gameLoop.submitAnswer(userAnswer)`
   - `advanceFn()` → `gameLoop.advanceToNext()`
   - `endFn()` → `gameLoop.endGameNow()`

6. **Remove or keep outside hook:**
   - Timer logic (stays outside if needed)
   - Complex question shuffling (stays outside)
   - Device-specific logic (stays outside)

## Refactoring Priority

1. ✅ **SpeedChallenge** — Simple, fixed questions, auto-advance
2. ⏳ **SpellingPractice** — Similar pattern to SpeedChallenge (easiest next step)
3. ⏳ **FlashcardGame** — Complex, multiple modes (major refactor required)
4. ❌ **Flashcard (Kingdom)** — Manual rating system (different pattern)
5. ❌ **MatchGame** — Card-based memory game (different pattern)

## Performance Notes

- Sound playing happens in `submitAnswer` automatically
- Focus management in component (outside hook)
- No re-renders for unrelated state changes
- Timeout refs cleaned up on unmount

## Future Enhancements

- [ ] Add time limits per question
- [ ] Add hints system
- [ ] Add lives/hearts system
- [ ] Support multiple validation modes (fuzzy matching, partial credit)
- [ ] Add difficulty level parameter
- [ ] Export stats for analytics

---

**Last Updated:** April 15, 2026 (Phase 2 Sprint 2.1)  
**Maintained By:** GitHub Copilot
