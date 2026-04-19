import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPELLING_WORDS } from '../data/words';
import './SpellingPractice.css';

const PEEK_DURATION_MS = 1000; // How long to show the answer when peeking

export default function SpellingPractice() {
  const navigate = useNavigate();
  const [words] = useState(SPELLING_WORDS);
  const [inputs, setInputs] = useState(() => words.map(() => ''));
  const [graded, setGraded] = useState(false);
  const [results, setResults] = useState(null);
  const [lockedCorrect, setLockedCorrect] = useState(new Set()); // Permanently correct words
  const [peekingIndices, setPeekingIndices] = useState(new Set());
  const [lastSpokenIndex, setLastSpokenIndex] = useState(null);
  const [lastSpokenSpeed, setLastSpokenSpeed] = useState('normal');
  const inputRefs = useRef([]);
  const peekTimeoutsRef = useRef({});

  const handleInputChange = (index, value) => {
    // Don't allow editing locked correct words
    if (lockedCorrect.has(index)) return;
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const speakWord = (word, index) => {
    if ('speechSynthesis' in window) {
      // If same word clicked again, slow it down. Otherwise, normal speed.
      const isRepeat = lastSpokenIndex === index && lastSpokenSpeed === 'normal';
      const rate = isRepeat ? 0.3 : 0.8; // 0.3 is very slow, 0.8 is normal
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = rate;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      
      // Update state
      setLastSpokenIndex(index);
      setLastSpokenSpeed(isRepeat ? 'slow' : 'normal');
    }
  };

  const speakSentence = (sentence) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.rate = 0.7;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = () => {
    const newResults = words.map((wordObj, index) => ({
      word: wordObj.word,
      sentence: wordObj.sentence,
      userInput: inputs[index].trim(),
      correct: inputs[index].trim().toLowerCase() === wordObj.word.toLowerCase(),
    }));
    setResults(newResults);
    setGraded(true);
    
    // Add newly correct words to locked set
    const newLocked = new Set(lockedCorrect);
    newResults.forEach((result, index) => {
      if (result.correct) {
        newLocked.add(index);
      }
    });
    setLockedCorrect(newLocked);
    inputRefs.current[0]?.focus();
  };

  const handlePeek = (index) => {
    // Show the answer for PEEK_DURATION_MS milliseconds
    setPeekingIndices(prev => new Set([...prev, index]));
    
    // Clear any existing timeout for this index
    if (peekTimeoutsRef.current[index]) {
      clearTimeout(peekTimeoutsRef.current[index]);
    }
    
    // Set new timeout to hide the answer
    peekTimeoutsRef.current[index] = setTimeout(() => {
      setPeekingIndices(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, PEEK_DURATION_MS);
  };

  const handleQuit = () => {
    navigate('/spelling');
  };

  const correctCount = lockedCorrect.size;
  const totalCount = words.length;
  const allCorrect = correctCount === totalCount;

  return (
    <div className="spelling-practice">
      <header className="sp-header">
        <div className="sp-crown">📝</div>
        <h1 className="sp-title">Spelling Practice</h1>
        <p className="sp-subtitle">Hear the word and spell it correctly!</p>
      </header>

      <div className="sp-words-container">
        {words.map((wordObj, index) => {
          const word = wordObj.word;
          const sentence = wordObj.sentence;
          const isLocked = lockedCorrect.has(index);
          const currentResult = results ? results[index] : null;
          
          return (
            <div key={index} className="sp-word-card">
              <div className="sp-word-header">
                <button
                  className="sp-speaker-btn"
                  onClick={() => speakWord(word, index)}
                  title="Click to hear the word"
                  aria-label={`Hear pronunciation of word ${index + 1}`}
                >
                  🔊
                </button>
                <button
                  className="sp-sentence-btn"
                  onClick={() => speakSentence(sentence)}
                  title="Click to hear the word used in a sentence"
                  aria-label="Hear word used in a sentence"
                >
                  💬
                </button>
                <span className="sp-word-number">{index + 1} / {words.length}</span>
              </div>
              {isLocked ? (
                <div className="sp-word-display">
                  {inputs[index]}
                </div>
              ) : (
                <input
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  className="sp-input"
                  value={inputs[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder="Type the word..."
                  aria-label={`Spelling word ${index + 1}`}
                  autoComplete="off"
                />
              )}
              {graded && currentResult && (
                <div className={`sp-result ${currentResult.correct ? 'correct' : 'incorrect'}`}>
                  <span className="sp-result-icon">
                    {currentResult.correct ? '✓' : '✗'}
                  </span>
                  {peekingIndices.has(index) && !currentResult.correct && (
                    <span className="sp-peeked-word">
                      <strong>{word}</strong>
                    </span>
                  )}
                  {!currentResult.correct && !peekingIndices.has(index) && (
                    <button
                      className="sp-peek-btn"
                      onClick={() => handlePeek(index)}
                      title="Peek at the correct answer for 1 second"
                    >
                      Hint
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sp-controls">
        {!allCorrect && (
          <>
            <button className="sp-submit-btn" onClick={handleSubmit}>
              Submit
            </button>
            <button className="sp-quit-btn" onClick={handleQuit}>
              Quit
            </button>
          </>
        )}
        {allCorrect && (
          <>
            <div className="sp-score">
              <div className="sp-score-text">
                <span className="sp-perfect">Perfect! 🌟</span>
              </div>
            </div>
            <button className="sp-quit-btn" onClick={handleQuit}>
              Back to Spelling
            </button>
          </>
        )}
      </div>
    </div>
  );
}
