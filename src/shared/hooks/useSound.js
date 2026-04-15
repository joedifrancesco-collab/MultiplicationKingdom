/**
 * useSound Hook
 * React hook for playing sound effects in components
 * Handles initialization and provides convenient sound playback methods
 */

import { useEffect } from 'react';
import soundManager from '../utils/soundManager';

export default function useSound() {
  useEffect(() => {
    // Initialize sound manager on first mount
    soundManager.init();
  }, []);

  return {
    play: (soundKey) => soundManager.play(soundKey),
    stop: (soundKey) => soundManager.stop(soundKey),
    stopAll: () => soundManager.stopAll(),
    toggleMute: () => soundManager.toggleMute(),
    setVolume: (vol) => soundManager.setVolume(vol),
    isMuted: soundManager.isMuted,
    volume: soundManager.volume,
  };
}
