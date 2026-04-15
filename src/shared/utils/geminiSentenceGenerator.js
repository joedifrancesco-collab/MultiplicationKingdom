/**
 * Generate contextual sentences using Google Gemini API
 * Each sentence helps students understand the word's meaning
 */

const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;

/**
 * Call Google Gemini API to generate contextual sentences
 * @param {Array<string>} words - Array of words to generate sentences for
 * @returns {Promise<Array<{word, sentence}>>} Array of word/sentence pairs
 */
export async function generateSentencesWithAI(words) {
  if (!GEMINI_API_KEY) {
    throw new Error('Google Gemini API key not configured. Set VITE_GOOGLE_GEMINI_API_KEY in .env.local');
  }

  if (words.length === 0) {
    throw new Error('No words provided');
  }

  const wordList = words.join(', ');
  
  const prompt = `Generate a contextual sentence for each of these spelling words. Each sentence should:
1. Help a student understand what the word means
2. Use the word in a realistic, age-appropriate context
3. Be 8-15 words long
4. Be clear and educational

Words: ${wordList}

Format your response EXACTLY as follows (one line per word):
word1|Sentence about word1 in context.
word2|Sentence about word2 in context.
word3|Sentence about word3 in context.

Do NOT include any other text, explanations, or formatting. Just the word|sentence pairs.`;

  try {
    // Use the official Gemini API endpoint with correct model name
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Gemini API error: ${error.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!responseText) {
      throw new Error('No response from Gemini API');
    }

    // Parse the response: word|sentence format, one per line
    const lines = responseText.trim().split('\n').filter(line => line.trim());
    
    const results = [];
    for (const line of lines) {
      const parts = line.split('|');
      if (parts.length === 2) {
        const word = parts[0].trim();
        const sentence = parts[1].trim();
        
        // Find the original word (case-insensitive) to get correct capitalization
        const originalWord = words.find(w => w.toLowerCase() === word.toLowerCase()) || word;
        
        if (sentence) {
          results.push({
            word: originalWord,
            sentence: sentence,
          });
        }
      }
    }

    if (results.length === 0) {
      throw new Error('Could not parse Gemini response');
    }

    return results;
  } catch (err) {
    const message = err.message || 'Unknown error calling Gemini API';
    throw new Error(`Failed to generate sentences: ${message}`);
  }
}
