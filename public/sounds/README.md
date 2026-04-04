# Game Sound Effects

This directory contains audio files for Multiplication Kingdom game feedback.

## Sound Files Needed

Place the following audio files in this directory:

### Feedback Sounds
- **correct.mp3** — Positive feedback for correct answer (cheerful, uplifting)
- **correct-alt.mp3** — Alternative correct sound for variety
- **wrong.mp3** — Negative feedback for incorrect answer (gentle, not alarming)

### Game Completion
- **level-complete.mp3** — Played when a kingdom/level is completed
- **star-collected.mp3** — Played when a star is earned
- **kingdom-unlocked.mp3** — Played when a new kingdom is unlocked

### UI & Game Events
- **button-click.mp3** — Subtle click for button interactions
- **popup-open.mp3** — Sound for opening menus/dialogs
- **towerBreached.mp3** — Sound for tower being breached in Kingdom Siege
- **game-over.mp3** — Game over/end screen sound

## Recommended Sources

### Free Creative Commons / Royalty-Free Audio
1. **Freesound.org** (freesound.cc)
   - Large library of user-submitted sounds
   - Filter by license (CC0, CC-BY, etc.)
   - Search: "game correct", "game wrong", "level complete"

2. **Zapsplat** (zapsplat.com)
   - Curated sound effects library
   - 100% free, no login required
   - Categories: Game, UI, Magic

3. **Pixabay Sound Effects** (pixabay.com/sound-effects)
   - High-quality sounds
   - CC0 license (free for commercial use)
   - Easy search and download

4. **OpenGameArt.org** (opengameart.org)
   - Sounds specifically for games
   - Open licenses
   - Community-driven

### Audio Specifications
- **Format**: MP3 (for web compatibility)
- **Duration**: 0.3–1.0s (short, punchy feedback sounds)
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

## Optional: Use Web Audio API for procedurally generated sounds

If you prefer not to download files, you can replace some sounds with Web Audio API generated tones:

```javascript
function playTone(frequency, duration = 0.2) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  
  oscillator.connect(envelope);
  envelope.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  envelope.gain.setValueAtTime(0.3, audioContext.currentTime);
  envelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// Usage:
playTone(800); // "ding" for correct
playTone(200); // deep tone for wrong
```

This approach avoids needing to host audio files.
