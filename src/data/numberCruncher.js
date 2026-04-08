/**
 * Number Cruncher Game Data & Logic
 * Generates numbers with progressive difficulty and scoring
 */

/**
 * Difficulty levels: 2 digits → 7 digits
 * Early levels allow digit repetition, later levels don't
 */
const DIFFICULTY_LEVELS = [
  { level: 1, digits: 2, allowRepeat: true },
  { level: 2, digits: 2, allowRepeat: false },
  { level: 3, digits: 3, allowRepeat: true },
  { level: 4, digits: 3, allowRepeat: false },
  { level: 5, digits: 4, allowRepeat: false },
  { level: 6, digits: 5, allowRepeat: false },
  { level: 7, digits: 6, allowRepeat: false },
  { level: 8, digits: 7, allowRepeat: false },
];

const TIME_PER_CHALLENGE = 5000; // 5 seconds in milliseconds
const MAX_LEVEL = DIFFICULTY_LEVELS.length;

/**
 * Generate a random number for the given difficulty level
 * @param {number} level - Current difficulty level (1-8)
 * @returns {string} The target number as a string
 */
export function generateNumber(level) {
  if (level < 1 || level > MAX_LEVEL) {
    level = 1; // Fallback to level 1
  }

  const config = DIFFICULTY_LEVELS[level - 1];
  const { digits, allowRepeat } = config;

  if (allowRepeat) {
    // Allow digit repetition: generate random digits (1-9 only, no 0)
    return Array.from({ length: digits }, () =>
      Math.floor(Math.random() * 9) + 1  // 1-9, not 0-9
    ).join('');
  } else {
    // No repetition: pick unique random digits (1-9 only, no 0)
    const availableDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const selected = [];

    for (let i = 0; i < digits; i++) {
      const randomIndex = Math.floor(Math.random() * availableDigits.length);
      selected.push(availableDigits[randomIndex]);
      availableDigits.splice(randomIndex, 1);
    }

    return selected.join('');
  }
}

/**
 * Validate user input against target number
 * @param {string} userInput - What the player typed
 * @param {string} targetNumber - The correct number
 * @returns {boolean} True if input matches target
 */
export function validateInput(userInput, targetNumber) {
  return userInput.trim() === targetNumber;
}

/**
 * Get the next level, or stay at max if at the top
 * @param {number} currentLevel - Current difficulty level
 * @returns {number} Next level (capped at MAX_LEVEL)
 */
export function getNextLevel(currentLevel) {
  return Math.min(currentLevel + 1, MAX_LEVEL);
}

/**
 * Calculate score based on correct answers and optional time bonus
 * For now: score = number of correct answers
 * @param {number} correctCount - Number of correct entries
 * @returns {number} Final score
 */
export function calculateScore(correctCount) {
  return correctCount;
}

/**
 * Get configuration for a specific level
 * @param {number} level - Difficulty level
 * @returns {object} Level config { level, digits, allowRepeat }
 */
export function getLevelConfig(level) {
  if (level < 1 || level > MAX_LEVEL) {
    level = 1;
  }
  return DIFFICULTY_LEVELS[level - 1];
}

export { TIME_PER_CHALLENGE, MAX_LEVEL, DIFFICULTY_LEVELS };
