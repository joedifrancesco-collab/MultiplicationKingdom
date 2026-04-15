/**
 * Auto-generate age-appropriate sentences for spelling words
 * Uses contextually-rich templates that actually make sense
 */

// These templates work for nearly any word and produce sensible sentences
const UNIVERSAL_TEMPLATES = [
  "I need to learn how to spell {word} correctly.",
  "The word {word} is important to understand.",
  "I want to spell {word} better every day.",
  "Understanding {word} helps me communicate well.",
  "I practiced spelling {word} in class today.",
  "My teacher taught me about the word {word}.",
  "I see the word {word} in many places.",
  "Spelling {word} correctly is a good skill.",
  "I will remember how to spell {word}.",
  "The definition of {word} is very useful.",
  "I use {word} when I write.",
  "Knowing {word} helps me express ideas better.",
  "I found the word {word} in my reading book.",
  "Using {word} makes my writing clearer.",
  "I learned {word} from the teacher.",
];

/**
 * Generate a sentence for a word
 * Uses universal, context-agnostic templates that work for any word
 * All sentences focus on the learning/spelling process rather than trying
 * to use the word in a potentially incorrect context
 * 
 * @param {string} word - The word to generate a sentence for
 * @returns {string} A sentence about learning/spelling this word
 */
export function generateSentenceForWord(word) {
  const randomIndex = Math.floor(Math.random() * UNIVERSAL_TEMPLATES.length);
  const template = UNIVERSAL_TEMPLATES[randomIndex];
  return template.replace('{word}', word);
}

/**
 * Generate sentences for a batch of words
 * 
 * @param {Array<string>} words - Array of words
 * @returns {Array<Object>} Array of {word, sentence} objects
 */
export function generateSentencesForWords(words) {
  return words.map(word => ({
    word: word.trim(),
    sentence: generateSentenceForWord(word.trim()),
  }));
}

/**
 * Parse a numbered list format into an array of words
 * Supports formats like:
 *   1. apple
 *   2. banana
 *   3. cat
 * 
 * Can also handle plain comma-separated or newline-separated lists
 * 
 * @param {string} textInput - Raw text input from textarea
 * @returns {Object} {words: Array<string>, errors: Array<string>}
 */
export function parseWordList(textInput) {
  const words = [];
  const errors = [];

  if (!textInput || textInput.trim() === '') {
    errors.push('No words provided');
    return { words, errors };
  }

  // Split by newlines or commas
  const lines = textInput.split(/[\r\n,]+/).map(line => line.trim()).filter(line => line);

  lines.forEach((line, idx) => {
    // Remove leading number and period (e.g., "1. ", "2. ")
    const withoutNumber = line.replace(/^\d+\.\s*/, '').trim();

    if (withoutNumber === '') {
      errors.push(`Line ${idx + 1}: Empty word (skipped)`);
      return;
    }

    // Validate: only letters, hyphens, and spaces allowed
    if (!/^[a-zA-Z\s\-']+$/.test(withoutNumber)) {
      errors.push(`Line ${idx + 1}: "${withoutNumber}" contains invalid characters`);
      return;
    }

    words.push(withoutNumber);
  });

  if (words.length === 0) {
    errors.push('No valid words found in the list');
  }

  return { words, errors };
}
