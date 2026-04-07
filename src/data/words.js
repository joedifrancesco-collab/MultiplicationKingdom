// Word groups for Spelling Practice game
export const SPELLING_WORD_GROUPS = [
  {
    id: '20260406',
    title: 'Spelling for the week of April 6th',
    words: [
      { word: 'picture', sentence: 'I hung a beautiful picture on my bedroom wall.' },
      { word: 'place', sentence: 'This is my favorite place to visit on weekends.' },
      { word: 'pull', sentence: 'Please pull the door open gently.' },
      { word: 'purple', sentence: 'She wore a purple dress to the party.' },
      { word: 'real', sentence: 'Is that a real diamond or a fake one?' },
      { word: 'ring', sentence: 'He gave her a diamond ring as an engagement gift.' },
      { word: 'rock', sentence: 'We found a smooth rock by the river.' },
      { word: 'round', sentence: 'The table is round, not square.' },
      { word: 'same', sentence: 'We always order the same thing at this restaurant.' },
      { word: 'sea', sentence: 'The sea was calm and beautiful this morning.' },
      { word: 'growth', sentence: 'Plants show rapid growth during spring.' },
      { word: 'change', sentence: 'Change can be difficult but necessary for progress.' },
      { word: 'height', sentence: 'His height makes him perfect for basketball.' },
      { word: 'weight', sentence: 'The weight of the box was too much to carry alone.' },
      { word: 'development', sentence: 'Child development happens at different rates for each child.' },
      { word: 'fraternal', sentence: 'Fraternal twins can look very different from each other.' },
      { word: 'siblings', sentence: 'She has three siblings: two brothers and one sister.' },
      { word: 'identical twins', sentence: 'Identical twins share the same DNA.' },
      { word: 'embryos', sentence: 'The embryos were studied in the science lab.' },
      { word: 'heredity', sentence: 'Heredity determines many of our physical traits.' },
    ],
  },
];

// Backwards compatibility: export current words for existing components
export const SPELLING_WORDS = SPELLING_WORD_GROUPS[0].words;
