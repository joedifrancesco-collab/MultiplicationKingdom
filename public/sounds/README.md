# Game Sound Effects

This directory contains audio files for Multiplication Kingdom game feedback.

## About Sound Effects

The app now includes a **sound effects system** with a **procedural audio fallback**:

- ✅ If audio files exist in this directory, they will be used
- ✅ If audio files are missing, the app automatically generates simple beep tones
- ✅ The app always works—whether with real audio or procedural fallback
- ✅ Users can mute sounds with the 🔊/🔇 button in-game

## Installation (Optional)

Adding real audio files improves the player experience. Follow these steps:

### Step 1: Choose & Download Audio Files

Pick one of these free sources:
- **Bitrate**: 128–192 kbps (good quality, small file size)
- **Sample Rate**: 44100 Hz (standard web audio)

### Suggested Sound Characteristics
- **Correct**: Uplifting, positive (e.g., "ding", "chime", "magical sparkle")
- **Wrong**: Gentle, not harsh or scary (e.g., soft "buzz", "low note", "sad trombone")
- **Completion**: Triumphant, celebratory (e.g., "fanfare", "victory jingle")
- **UI Clicks**: Subtle, quick (e.g., "click", "blip")

## Installation Steps

1. Download MP3 files from one of the sources above
2. Rename them to match the filenames in `src/utils/soundManager.js`
3. Place them in this `public/sounds/` directory
4. Test in dev environment: Sounds should play when:
   - Answering questions correctly/incorrectly in games
   - Completing levels
   - Earning stars

## Installation (Optional)

Adding real audio files improves the player experience. Follow these steps:

### Step 1: Choose & Download Audio Files

Pick one of these free sources:

1. **Freesound.org** (freesound.org)
   - Search: "game correct ding", "game wrong buzz", "level complete fanfare"
   - Filter by license: Creative Commons 0 (CC0) for commercial use
   - Download as MP3

2. **Zapsplat** (zapsplat.com)
   - Categories: Game → UI → Sound Effects
   - Search: "correct", "wrong", "complete"
   - All sounds are free / CC0

3. **Pixabay Sound Effects** (pixabay.com/sound-effects)
   - Search: "game correct", "game wrong", "level up"
   - CC0 license (free for all uses)

4. **OpenGameArt.org** (opengameart.org)
   - Category: Sounds → Game
   - Various open licenses

### Step 2: Place Files in This Directory

Create MP3 files with these exact names:

#### Required (for core gameplay)
- **correct.mp3** — Positive feedback (cheerful beep/ding, ~0.3s)
- **wrong.mp3** — Negative feedback (gentle buzz/sad tone, ~0.4s)

#### Optional (for enhanced experience)
- **correct-alt.mp3** — Alternative correct sound for variety
- **level-complete.mp3** — When a kingdom is completed
- **star-collected.mp3** — When a star is earned  
- **kingdom-unlocked.mp3** — When a new kingdom is unlocked
- **button-click.mp3** — UI click feedback
- **popup-open.mp3** — Dialog/menu open sound
- **towerBreached.mp3** — Kingdom Siege tower breach
- **game-over.mp3** — Game over screen

### Step 3: Test

Run `npm run dev` and play a game. Sounds should play on correct/wrong answers.

## Audio File Specifications

If downloading or creating audio files, use these specs:

```
Format:     MP3
Bitrate:    128–192 kbps (good quality, small file size)
Sample Rate: 44100 Hz (standard for web)
Duration:   0.3–1.0s (short, punchy feedback)
Mono/Stereo: Either (mono is smaller)
```

## Procedural Audio Fallback (Built-In)

The app includes a **free procedural audio system** as fallback:

- If audio files are not found, the app automatically detects this
- Generates simple tone feedback using Web Audio API
- Frequency/duration tuned for each sound type
- Works on all browsers (no audio files needed)
- Users still get audio feedback + mute control

This means the app **always works**, whether you add audio files or not! 🎵

## Current Implementation

Sound effects are integrated into:
- ✅ **FlashcardGame** — Correct/wrong answer feedback
- ✅ **SpeedChallenge** — Correct/wrong answer feedback  
- ⏳ **MatchGame** — (ready to add)
- ⏳ **KingdomSiege** — (ready to add)
- ⏳ **Flashcard.jsx** (Conquest) — (ready to add)

All games have a mute button (🔊/🔇) to toggle sounds on/off.

## Troubleshooting

**No sound at all:**
- Check browser console for errors: F12 → Console
- Try muting/unmuting with the 🔊 button (should toggle)
- Try a different browser
- Procedural fallback should work (simple beeps)

**Audio files aren't playing, fallback is used instead:**
- File not found (check spelling/location)
- Browser autoplay policy blocked it (mute → unmute usually fixes)
- Try a different browser or device
- See [MDN: Autoplay Policy](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide)

**Want to verify fallback is working:**
- Open DevTools (F12) → Console
- You'll see: ✅ procedural tone plays (or audio file if found)
- Simple beeps = working fallback! 🎉

---

**Have questions?** Check `.github/copilot-instructions.md` for architecture details.

