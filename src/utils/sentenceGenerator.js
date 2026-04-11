/**
 * Auto-generate age-appropriate sentences for spelling words
 * Uses simple templates to create context sentences
 */

const SENTENCE_TEMPLATES = [
  "I love the word '{word}'.",
  "The word '{word}' is interesting.",
  "I learned a new word: '{word}'.",
  "The word '{word}' means something special.",
  "Can you spell '{word}' correctly?",
  "'{word}' is a challenging word.",
  "I use the word '{word}' every day.",
  "The word '{word}' is useful.",
  "Writing '{word}' helps me remember it.",
  "'{word}' is a fun word to say.",
  "I think '{word}' is important.",
  "The word '{word}' looks interesting.",
  "Learning '{word}' will help you succeed.",
  "'{word}' is spelled like this.",
  "Practicing '{word}' makes me better.",
  "The word '{word}' has a nice sound.",
  "I enjoy spelling '{word}'.",
  "'{word}' is a new challenge for me.",
  "Understanding '{word}' is useful.",
  "The word '{word}' is worth learning.",
];

/**
 * Generate a sentence for a word
 * Uses template-based approach to ensure age-appropriate, simple sentences
 * 
 * @param {string} word - The word to generate a sentence for
 * @returns {string} A sentence containing the word
 */
export function generateSentenceForWord(word) {
  const randomIndex = Math.floor(Math.random() * SENTENCE_TEMPLATES.length);
  const template = SENTENCE_TEMPLATES[randomIndex];
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
