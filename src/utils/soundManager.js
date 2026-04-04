/**
 * Sound Manager
 * Centralized audio handling for game sound effects and feedback
 * Manages volume, muting, and sound playback across the app
 */

class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = localStorage.getItem('mk_sound_muted') === 'true';
    this.volume = parseFloat(localStorage.getItem('mk_sound_volume')) || 0.7;
    this.initialized = false;
  }

  /**
   * Initialize sound manager with audio assets
   * Called once on app startup
   */
  init() {
    if (this.initialized) return;

    // Map of sound keys to audio file paths (relative to public/)
    const soundAssets = {
      // Correct answer feedback
      correct: '/sounds/correct.mp3',
      correctAlt: '/sounds/correct-alt.mp3',
      
      // Wrong answer feedback
      wrong: '/sounds/wrong.mp3',
      
      // Level/kingdom completion
      levelComplete: '/sounds/level-complete.mp3',
      allStarCollected: '/sounds/star-collected.mp3',
      
      // UI interactions
      buttonClick: '/sounds/button-click.mp3',
      popupOpen: '/sounds/popup-open.mp3',
      
      // Game-specific
      kingdomUnlocked: '/sounds/kingdom-unlocked.mp3',
      towerBreached: '/sounds/tower-breached.mp3',
      gameOver: '/sounds/game-over.mp3',
    };

    // Pre-create audio elements for each sound
    Object.entries(soundAssets).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = this.volume;
      this.sounds[key] = audio;
    });

    this.initialized = true;
  }

  /**
   * Play a sound effect
   * @param {string} soundKey - The key of the sound to play (e.g., 'correct', 'wrong')
   */
  play(soundKey) {
    if (this.isMuted || !this.sounds[soundKey]) return;

    const audio = this.sounds[soundKey];
    // Reset playback to start
    audio.currentTime = 0;
    audio.play().catch(err => {
      // Silently handle autoplay policy restrictions
      console.debug(`Sound play blocked: ${soundKey}`, err);
    });
  }

  /**
   * Stop a sound effect
   * @param {string} soundKey - The key of the sound to stop
   */
  stop(soundKey) {
    if (this.sounds[soundKey]) {
      this.sounds[soundKey].pause();
      this.sounds[soundKey].currentTime = 0;
    }
  }

  /**
   * Stop all sounds
   */
  stopAll() {
    Object.values(this.sounds).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  /**
   * Toggle mute state and persist to localStorage
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('mk_sound_muted', this.isMuted);
    return this.isMuted;
  }

  /**
   * Set volume level (0-1) and persist to localStorage
   * @param {number} vol - Volume level between 0 and 1
   */
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('mk_sound_volume', this.volume);
    
    // Update all audio elements
    Object.values(this.sounds).forEach(audio => {
      audio.volume = this.volume;
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
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
