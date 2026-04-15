/**
 * Simple profanity filter for child-safe leaderboard
 * Redacts inappropriate words with pattern: f***k (first + last letter visible)
 */

// Built-in list of inappropriate words to filter
const DEFAULT_PROFANITIES = [
  'ass', 'asshole', 'bastard', 'bitch', 'crap', 'damn', 'dammit', 'damnit',
  'fart', 'frick', 'fuck', 'fork', 'hell', 'piss',
  'shit', 'shitty', 'cock', 'cunt', 'dick', 'dildo', 'douche',
  'fag', 'faggot', 'goddamn', 'goddam', 'jackass', 'jerk', 'jizz',
  'motherfucker', 'prick', 'pussy', 'slut', 'tit', 'twat', 'wanker', 'whore'
];

// Allow customization of the word list
let profanities = [...DEFAULT_PROFANITIES];

/**
 * Escape special regex characters
 * @param {string} str - String to escape
 * @returns {string} - Escaped string safe for regex
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Redact inappropriate words with pattern: f***u (first + last letter visible)
 * For emails/usernames, redacts entire sections that contain profanity
 * @param {string} text - Text to filter (email, username, etc.)
 * @returns {string} - Text with inappropriate word sections redacted
 */
export function redactProfanity(text) {
  if (!text || typeof text !== 'string') return text;

  // Split by common delimiters (@, .)
  const result = text
    .split(/(@|\.)/)
    .map(part => {
      // If it's a delimiter, return as-is
      if (part === '@' || part === '.') return part;
      
      // Check if this part contains any profanity
      const hasProfanity = profanities.some(word => {
        const escapedWord = escapeRegExp(word);
        const regex = new RegExp(escapedWord, 'i');
        return regex.test(part);
      });
      
      // If it has profanity, redact the entire section
      return hasProfanity ? redactWord(part) : part;
    })
    .join('');
  
  return result;
}

/**
 * Redact a single word: show first and last letter, hide middle
 * @param {string} word - Word to redact
 * @returns {string} - Redacted word (e.g., "f***k")
 */
function redactWord(word) {
  if (word.length <= 2) {
    return word.charAt(0) + '*';
  }
  
  const first = word.charAt(0);
  const last = word.charAt(word.length - 1);
  const middle = '*'.repeat(word.length - 2);
  
  return first + middle + last;
}

/**
 * Check if text contains explicit content
 * @param {string} text - Text to check
 * @returns {boolean} - True if contains bad words
 */
export function containsProfanity(text) {
  if (!text || typeof text !== 'string') return false;
  
  return profanities.some(word => {
    const escapedWord = escapeRegExp(word);
    const regex = new RegExp(escapedWord, 'i');
    return regex.test(text);
  });
}

/**
 * Add custom words to the filter
 * @param {string[]} words - Array of custom words to filter
 */
export function addCustomWords(words) {
  if (Array.isArray(words)) {
    profanities = [...new Set([...profanities, ...words])];
  }
}
