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
 * @returns {boolean} true if validation passed
 */
export function validateSettings() {
  const errors = [];
  const warnings = [];
  
  // Check required app-level settings
  if (!activeSettings.app?.name) warnings.push('Missing app.name');
  if (!activeSettings.theme?.primary) warnings.push('Missing theme.primary');
  
  // Check that at least one game is enabled
  const enabledGames = Object.entries(activeSettings.games || {})
    .filter(([, config]) => config.enabled)
    .map(([name]) => name);
  
  if (enabledGames.length === 0) {
    warnings.push('No games are enabled in settings');
  }
  
  // Log results
  if (warnings.length > 0) {
    console.warn('⚠️  Settings validation warnings:', warnings);
  }
  if (errors.length > 0) {
    console.error('❌ Settings validation errors:', errors);
    return false;
  }
  
  console.log(`✅ Settings loaded (${enabledGames.length} games enabled)`);
  return true;
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
