/**
 * Auto-generate age-appropriate sentences for spelling words
 * Uses contextually-rich templates organized by word type
 */

// Noun-friendly templates (subjects/objects in context)
const NOUN_TEMPLATES = [
  "I saw a beautiful {word} yesterday.",
  "My favorite {word} is very special.",
  "I have a {word} that I love.",
  "The {word} was hidden in the room.",
  "Every day I use a {word}.",
  "I learned about the {word} in school.",
  "The {word} belongs to my friend.",
  "Our {word} is amazing.",
  "I saw the {word} at the store.",
  "The {word} is one of my favorite things.",
];

// Verb-friendly templates (action in context)
const VERB_TEMPLATES = [
  "I like to {word} after school.",
  "We {word} songs around the campfire.",
  "I learn to {word} every day.",
  "You should {word} more often.",
  "I will {word} as soon as I can.",
  "We {word} together in the park.",
  "She decided to {word} during lunch.",
  "I enjoy when I {word}.",
  "Learning to {word} is helpful.",
  "I am getting better at {word}.",
];

// Adjective/descriptor templates
const ADJECTIVE_TEMPLATES = [
  "The {word} sky was beautiful today.",
  "I think this is very {word}.",
  "The {word} flowers looked amazing.",
  "She wore a {word} dress to the party.",
  "That {word} idea was wonderful.",
  "The {word} version is much better.",
  "I prefer the {word} one.",
  "This {word} book is really interesting.",
  "The {word} taste was delicious.",
  "His {word} laugh made everyone smile.",
];

// Number/quantity templates
const NUMBER_TEMPLATES = [
  "{word} is an important number.",
  "I bought {word} apples from the store.",
  "There are {word} days in a week.",
  "She won {word} ribbons at the contest.",
  "I counted {word} stars in the sky.",
  "We ate {word} cookies after school.",
  "The class has {word} students.",
  "I read {word} chapters of my book.",
  "There are {word} people in my family.",
  "I saved {word} dollars in my piggy bank.",
];

// Generic templates (work for multiple word types)
const GENERIC_TEMPLATES = [
  "I learned about {word} at school.",
  "The teacher explained {word} carefully.",
  "I practice {word} every day.",
  "Understanding {word} is important.",
  "{word} is useful in many ways.",
  "I enjoy learning about {word}.",
  "The concept of {word} is interesting.",
  "I use {word} in my daily life.",
  "Learning {word} helps me improve.",
  "I will remember {word} forever.",
];

// Combine all templates
const ALL_TEMPLATES = [
  ...NOUN_TEMPLATES,
  ...VERB_TEMPLATES,
  ...ADJECTIVE_TEMPLATES,
  ...NUMBER_TEMPLATES,
  ...GENERIC_TEMPLATES,
];

/**
 * Detect likely word type based on simple heuristics
 * Returns: 'noun', 'verb', 'adjective', 'number', or 'generic'
 */
function detectWordType(word) {
  const lowercased = word.toLowerCase();
  
  // Common number words
  const numberWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'dozen', 'hundred', 'thousand'];
  if (numberWords.includes(lowercased)) return 'number';
  
  // Common verb endings
  if (lowercased.match(/(ing|ed|le|te|se|ze)$/)) return 'verb';
  if (lowercased.match(/^(be|have|do|go|run|walk|sing|play|jump|find)/)) return 'verb';
  
  // Common adjective endings
  if (lowercased.match(/(ful|less|ous|ious|able|ible|ish|ive|ant|ent)$/)) return 'adjective';
  if (lowercased.match(/^(happy|sad|big|small|good|bad|beautiful|ugly)/)) return 'adjective';
  
  // Default to noun (most common in spelling lists)
  return 'noun';
}

/**
 * Generate a sentence for a word
 * Uses word-type detection to choose appropriate templates
 * 
 * @param {string} word - The word to generate a sentence for
 * @returns {string} A sentence containing the word in context
 */
export function generateSentenceForWord(word) {
  const wordType = detectWordType(word);
  let templates = GENERIC_TEMPLATES;
  
  switch(wordType) {
    case 'noun':
      templates = NOUN_TEMPLATES;
      break;
    case 'verb':
      templates = VERB_TEMPLATES;
      break;
    case 'adjective':
      templates = ADJECTIVE_TEMPLATES;
      break;
    case 'number':
      templates = NUMBER_TEMPLATES;
      break;
    default:
      templates = GENERIC_TEMPLATES;
  }
  
  const randomIndex = Math.floor(Math.random() * templates.length);
  const template = templates[randomIndex];
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
