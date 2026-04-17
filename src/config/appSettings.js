/**
 * App Settings Manager
 * 
 * Centralized location for all game configuration.
 * Loads appsettings.json at startup and provides simple API to access/override settings.
 * 
 * Usage:
 *   import { getSettings, getSetting, overrideSetting } from './config/appSettings';
 *   
 *   // Get all settings
 *   const allSettings = getSettings();
 *   
 *   // Get specific setting with dot notation
 *   const flashcardTimedLimit = getSetting('games.multiplicationFlashcard.timeLimits.timed');
 *   
 *   // Local override (doesn't persist, only for this session)
 *   overrideSetting('games.spellingPractice.timeLimits.default', 120);
 */

import settingsJSON from './appsettings.json';

// Master copy (never modified, always pristine)
const DEFAULT_SETTINGS = structuredClone(settingsJSON);

// Working copy (can be overridden)
let activeSettings = structuredClone(DEFAULT_SETTINGS);

/**
 * Deep get using dot notation
 * @param {string} path - e.g., "games.multiplicationFlashcard.timeLimits.timed"
 * @param {*} defaultValue - fallback if path doesn't exist
 * @returns {*} the value at path, or defaultValue if not found
 */
function getNestedValue(obj, path, defaultValue = null) {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  
  return current;
}

/**
 * Deep set using dot notation
 * @param {object} obj - object to modify
 * @param {string} path - e.g., "games.multiplicationFlashcard.timeLimits.timed"
 * @param {*} value - value to set
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
}

/**
 * Get all settings (returns a copy, safe to modify)
 * @returns {object}
 */
export function getSettings() {
  return structuredClone(activeSettings);
}

/**
 * Get a specific setting by dot-notation path
 * @param {string} path - e.g., "games.multiplicationFlashcard.timeLimits.timed"
 * @param {*} defaultValue - fallback if not found
 * @returns {*}
 */
export function getSetting(path, defaultValue = null) {
  return getNestedValue(activeSettings, path, defaultValue);
}

/**
 * Override a setting (session-only, not persisted)
 * Useful for testing, admin panels, or runtime configuration
 * 
 * @param {string} path - e.g., "games.multiplicationFlashcard.timeLimits.timed"
 * @param {*} value - new value
 * @returns {boolean} true if override was successful
 */
export function overrideSetting(path, value) {
  try {
    setNestedValue(activeSettings, path, value);
    return true;
  } catch (err) {
    console.error(`Failed to override setting "${path}":`, err);
    return false;
  }
}

/**
 * Reset all settings to defaults
 * Clears any session-only overrides
 */
export function resetSettings() {
  activeSettings = structuredClone(DEFAULT_SETTINGS);
}

/**
 * Check if a game is enabled
 * @param {string} gameKey - e.g., "multiplicationFlashcard", "spelling"
 * @returns {boolean}
 */
export function isGameEnabled(gameKey) {
  return getSetting(`games.${gameKey}.enabled`, false);
}

/**
 * Get game platform compatibility
 * @param {string} gameKey - e.g., "multiplicationFlashcard"
 * @returns {string} "desktop", "mobile", or "both"
 */
export function getGamePlatforms(gameKey) {
  return getSetting(`games.${gameKey}.platforms`, 'both');
}

/**
 * Validate settings on startup
 * Logs warnings if critical settings are missing
 * Checks required schema fields and game configuration
 * @returns {object} { valid: boolean, errors: string[], warnings: string[] }
 */
export function validateSettings() {
  const errors = [];
  const warnings = [];
  
  // Check required top-level sections
  const requiredSections = ['app', 'theme', 'difficulty', 'games', 'audio', 'ui', 'leaderboard', 'auth', 'logging'];
  for (const section of requiredSections) {
    if (!activeSettings[section]) {
      errors.push(`Missing required section: ${section}`);
    }
  }
  
  // Validate app section
  if (activeSettings.app) {
    if (!activeSettings.app.name) errors.push('Missing app.name');
    if (!activeSettings.app.version) errors.push('Missing app.version');
    if (!activeSettings.app.environment) errors.push('Missing app.environment');
  }
  
  // Validate theme
  if (activeSettings.theme) {
    const requiredColors = ['primary', 'secondary', 'success', 'accent', 'background'];
    for (const color of requiredColors) {
      if (!activeSettings.theme[color]) {
        errors.push(`Missing theme.${color}`);
      }
    }
    if (!activeSettings.theme.borderRadius) {
      errors.push('Missing theme.borderRadius');
    }
  }
  
  // Validate difficulty
  if (activeSettings.difficulty) {
    if (!activeSettings.difficulty.levels?.easy || !activeSettings.difficulty.levels?.medium || !activeSettings.difficulty.levels?.hard) {
      errors.push('Missing difficulty levels (easy, medium, hard)');
    }
    if (!activeSettings.difficulty.default) {
      errors.push('Missing difficulty.default');
    }
  }
  
  // Check that at least one game is enabled
  const enabledGames = Object.entries(activeSettings.games || {})
    .filter(([, config]) => config.enabled === true)
    .map(([name]) => name);
  
  if (enabledGames.length === 0) {
    warnings.push('No games are enabled in settings');
  } else {
    // Validate each enabled game has required fields
    for (const [gameName, gameConfig] of Object.entries(activeSettings.games || {})) {
      if (gameConfig.enabled) {
        if (!gameConfig.platforms) errors.push(`Game "${gameName}": missing platforms`);
        if (!gameConfig.defaultDifficulty) errors.push(`Game "${gameName}": missing defaultDifficulty`);
      }
    }
  }
  
  // Validate audio section
  if (activeSettings.audio) {
    if (activeSettings.audio.enabled === undefined) errors.push('Missing audio.enabled');
    if (activeSettings.audio.defaultVolume === undefined) errors.push('Missing audio.defaultVolume');
  }
  
  // Validate UI section
  if (activeSettings.ui) {
    if (activeSettings.ui.animationsEnabled === undefined) errors.push('Missing ui.animationsEnabled');
    if (activeSettings.ui.feedbackDuration === undefined) errors.push('Missing ui.feedbackDuration');
  }
  
  // Validate leaderboard section
  if (activeSettings.leaderboard) {
    if (activeSettings.leaderboard.enabled === undefined) errors.push('Missing leaderboard.enabled');
    if (activeSettings.leaderboard.maxEntries === undefined) errors.push('Missing leaderboard.maxEntries');
  }
  
  // Log results
  const result = {
    valid: errors.length === 0,
    errors,
    warnings,
    enabledGamesCount: enabledGames.length
  };
  
  if (errors.length > 0) {
    console.error(`❌ Settings validation FAILED (${errors.length} error${errors.length !== 1 ? 's' : ''}):`);
    errors.forEach(err => console.error(`   • ${err}`));
  }
  
  if (warnings.length > 0) {
    console.warn(`⚠️  Settings validation warnings (${warnings.length}):`);
    warnings.forEach(warn => console.warn(`   • ${warn}`));
  }
  
  if (result.valid) {
    console.log(`✅ Settings loaded successfully (${enabledGames.length} game${enabledGames.length !== 1 ? 's' : ''} enabled)`);
    console.log(`   Version: ${activeSettings.app?.version || 'unknown'}`);
    console.log(`   Environment: ${activeSettings.app?.environment || 'unknown'}`);
  }
  
  return result;
}

/**
 * Get app metadata
 * @returns {object} { name, version, environment }
 */
export function getAppMetadata() {
  return getSetting('app', {});
}

/**
 * Get all enabled games with their config
 * @returns {object} { [gameName]: gameConfig, ... }
 */
export function getEnabledGames() {
  const games = getSetting('games', {});
  return Object.entries(games)
    .filter(([, config]) => config.enabled)
    .reduce((acc, [name, config]) => {
      acc[name] = config;
      return acc;
    }, {});
}

/**
 * Export for debugging/admin tools
 * Returns current state of all settings
 * @returns {object}
 */
export function getSettingsForDebug() {
  return {
    active: activeSettings,
    defaults: DEFAULT_SETTINGS,
    isDifferent: JSON.stringify(activeSettings) !== JSON.stringify(DEFAULT_SETTINGS),
  };
}

export default {
  getSettings,
  getSetting,
  overrideSetting,
  resetSettings,
  isGameEnabled,
  getGamePlatforms,
  validateSettings,
  getAppMetadata,
  getEnabledGames,
  getSettingsForDebug,
};
