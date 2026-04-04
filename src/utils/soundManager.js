/**
 * Sound Manager
 * Centralized audio handling for game sound effects and feedback
 * Manages volume, muting, and sound playback across the app
 * 
 * Fallback: If audio files are not available, generates simple procedural tones
 */

/**
 * Generate a simple beep tone using Web Audio API (fallback for missing audio files)
 * @param {number} frequency - Hz (e.g., 800 for high beep, 400 for low)
 * @param {number} duration - seconds (e.g., 0.2)
 * @param {string} type - oscillator type ('sine', 'square', 'sawtooth', 'triangle')
 */
function playTone(frequency = 800, duration = 0.2, type = 'sine') {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    // Fade in and out
    envelope.gain.setValueAtTime(0.3, audioContext.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (err) {
    console.debug('Web Audio API not available:', err);
  }
}

class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = localStorage.getItem('mk_sound_muted') === 'true';
    this.volume = parseFloat(localStorage.getItem('mk_sound_volume')) || 0.7;
    this.initialized = false;
    this.useFallback = false;
  }

  /**
   * Initialize sound manager with audio assets
   * Falls back to procedural tones if audio files are unavailable
   */
  init() {
    if (this.initialized) return;

    // Map of sound keys to audio file paths and fallback tone configs
    const soundAssets = {
      // Correct answer feedback: cheerful high tone
      correct: { path: '/sounds/correct.mp3', fallback: { freq: 800, duration: 0.3, type: 'sine' } },
      correctAlt: { path: '/sounds/correct-alt.mp3', fallback: { freq: 1000, duration: 0.25, type: 'sine' } },
      
      // Wrong answer feedback: gentle low tone
      wrong: { path: '/sounds/wrong.mp3', fallback: { freq: 300, duration: 0.4, type: 'sine' } },
      
      // Level/kingdom completion: triumphant
      levelComplete: { path: '/sounds/level-complete.mp3', fallback: { freq: 900, duration: 0.5, type: 'square' } },
      allStarCollected: { path: '/sounds/star-collected.mp3', fallback: { freq: 1200, duration: 0.3, type: 'sine' } },
      
      // UI interactions
      buttonClick: { path: '/sounds/button-click.mp3', fallback: { freq: 600, duration: 0.15, type: 'sine' } },
      popupOpen: { path: '/sounds/popup-open.mp3', fallback: { freq: 700, duration: 0.2, type: 'sine' } },
      
      // Game-specific
      kingdomUnlocked: { path: '/sounds/kingdom-unlocked.mp3', fallback: { freq: 1000, duration: 0.6, type: 'square' } },
      towerBreached: { path: '/sounds/tower-breached.mp3', fallback: { freq: 200, duration: 0.3, type: 'sine' } },
      gameOver: { path: '/sounds/game-over.mp3', fallback: { freq: 250, duration: 0.8, type: 'sine' } },
    };

    // Try to load actual audio files, fall back to procedural tones
    Object.entries(soundAssets).forEach(([key, config]) => {
      const audio = new Audio(config.path);
      audio.preload = 'auto';
      audio.volume = this.volume;
      
      // Handle loading error → use procedural fallback
      audio.onerror = () => {
        this.useFallback = true;
        this.sounds[key] = { type: 'procedural', config: config.fallback };
      };
      
      this.sounds[key] = audio;
    });

    this.initialized = true;
  }

  /**
   * Play a sound effect or procedural tone
   * @param {string} soundKey - The key of the sound to play
   */
  play(soundKey) {
    if (this.isMuted || !this.sounds[soundKey]) return;

    const sound = this.sounds[soundKey];

    if (sound.type === 'procedural' && sound.config) {
      // Use procedural tone as fallback
      const cfg = sound.config;
      playTone(cfg.freq, cfg.duration, cfg.type);
    } else if (sound instanceof HTMLAudioElement) {
      // Play actual audio file
      sound.currentTime = 0;
      sound.play().catch(err => {
        // Silently handle autoplay policy restrictions
        console.debug(`Sound play blocked: ${soundKey}`, err);
      });
    }
  }

  /**
   * Stop a sound effect
   * @param {string} soundKey
   */
  stop(soundKey) {
    const sound = this.sounds[soundKey];
    if (sound instanceof HTMLAudioElement) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Stop all sounds
   */
  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      if (sound instanceof HTMLAudioElement) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }

  /**
   * Toggle mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('mk_sound_muted', this.isMuted);
    return this.isMuted;
  }

  /**
   * Set volume level (0-1)
   * @param {number} vol - Volume between 0 and 1
   */
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('mk_sound_volume', this.volume);
    
    // Update all audio elements
    Object.values(this.sounds).forEach(sound => {
      if (sound instanceof HTMLAudioElement) {
        sound.volume = this.volume;
      }
    });
  }

  /**
   * Get current mute state
   */
  getMuted() {
    return this.isMuted;
  }

  /**
   * Get current volume level
   */
  getVolume() {
    return this.volume;
  }

  /**
   * Check if using procedural fallback tones
   */
  isUsingFallback() {
    return this.useFallback;
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;

