/**
 * useSettings Hook
 * 
 * Provides easy access to app settings in React components.
 * Uses memoization to prevent unnecessary re-renders.
 * 
 * Usage:
 *   const { getSetting, isGameEnabled, getGamePlatforms } = useSettings();
 *   const timeLimit = getSetting('games.speedChallenge.timeLimits.default');
 *   const enabled = isGameEnabled('spelling');
 */

import { useMemo } from 'react';
import { getSetting, isGameEnabled, getGamePlatforms, getSettings, getEnabledGames } from '../config/appSettings';

export default function useSettings() {
  return useMemo(() => ({
    /**
     * Get a specific setting by dot-notation path
     * @param {string} path - e.g., "games.speedChallenge.timeLimits.default"
     * @param {*} defaultValue - fallback if not found
     * @returns {*}
     */
    getSetting: (path, defaultValue = null) => getSetting(path, defaultValue),

    /**
     * Check if a game is enabled
     * @param {string} gameKey - e.g., "speedChallenge", "spelling"
     * @returns {boolean}
     */
    isGameEnabled: (gameKey) => isGameEnabled(gameKey),

    /**
     * Get game platform compatibility
     * @param {string} gameKey - e.g., "speedChallenge"
     * @returns {string} "desktop", "mobile", or "both"
     */
    getGamePlatforms: (gameKey) => getGamePlatforms(gameKey),

    /**
     * Get all settings
     * @returns {object}
     */
    getSettings: () => getSettings(),

    /**
     * Get all enabled games with their configuration
     * @returns {object} { [gameName]: gameConfig, ... }
     */
    getEnabledGames: () => getEnabledGames(),

    /**
     * Get app theme colors
     * @returns {object} { primary, secondary, success, accent, background, borderRadius }
     */
    getTheme: () => getSetting('theme', {}),

    /**
     * Get audio settings
     * @returns {object} { enabled, defaultVolume, sounds }
     */
    getAudio: () => getSetting('audio', {}),

    /**
     * Get UI settings
     * @returns {object} { animationsEnabled, feedbackDuration, transitionDuration }
     */
    getUI: () => getSetting('ui', {}),

    /**
     * Get game time limit
     * @param {string} gameKey - e.g., "speedChallenge"
     * @param {string} mode - e.g., "default", "timed", "sprint" (optional)
     * @returns {number|null} milliseconds or null if untimed
     */
    getTimeLimit: (gameKey, mode = 'default') => {
      const seconds = getSetting(`games.${gameKey}.timeLimits.${mode}`, null);
      return seconds !== null ? seconds * 1000 : null;
    },

    /**
     * Get game scoring configuration
     * @param {string} gameKey - e.g., "speedChallenge"
     * @returns {object} { pointsPerCorrect, penaltyPerWrong, ... }
     */
    getScoring: (gameKey) => getSetting(`games.${gameKey}.scoring`, {}),

    /**
     * Get difficulty level
     * @param {string} level - "easy", "medium", "hard"
     * @returns {number} numeric level (1, 2, 3, etc.)
     */
    getDifficultyLevel: (level = 'medium') => {
      return getSetting(`difficulty.levels.${level}`, 2);
    },

    /**
     * Check if animations are enabled
     * @returns {boolean}
     */
    areAnimationsEnabled: () => getSetting('ui.animationsEnabled', true),

    /**
     * Get feedback delay duration
     * @returns {number} milliseconds
     */
    getFeedbackDuration: () => getSetting('ui.feedbackDuration', 1000),

    /**
     * Get transition duration
     * @returns {number} milliseconds
     */
    getTransitionDuration: () => getSetting('ui.transitionDuration', 300),

    /**
     * Check if leaderboard is enabled
     * @returns {boolean}
     */
    isLeaderboardEnabled: () => getSetting('leaderboard.enabled', true),

    /**
     * Check if guest mode is enabled
     * @returns {boolean}
     */
    isGuestModeEnabled: () => getSetting('auth.guestModeEnabled', true),
  }), []);
}
