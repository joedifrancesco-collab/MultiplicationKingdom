import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSpellingWordsFromFirebase } from '../data/words';
import { saveSpellingAttempt } from '../../../../store/progress';
import './SpellingPractice.css';

const PEEK_DURATION_MS = 1000; // How long to show the answer when peeking

export default function SpellingPractice() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  
  // State for loading and error
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Spelling state
  const [words, setWords] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [graded, setGraded] = useState(false);
  const [results, setResults] = useState(null);
  const [lockedCorrect, setLockedCorrect] = useState(new Set());
  const [peekingIndices, setPeekingIndices] = useState(new Set());
  const [lastSpokenIndex, setLastSpokenIndex] = useState(null);
  const [lastSpokenSpeed, setLastSpokenSpeed] = useState('normal');
  const [submitCount, setSubmitCount] = useState(0);
  const [firstAttemptCorrectCount, setFirstAttemptCorrectCount] = useState(null);
  
  const inputRefs = useRef([]);
  const peekTimeoutsRef = useRef({});

  // Load the group from Firestore by ID
  useEffect(() => {
    const loadGroup = async () => {
      setLoading(true);
      setError('');
      try {
        let groups = await fetchSpellingWordsFromFirebase(true); // Include archived
        const group = groups.find(g => g.id === groupId);
        
        if (!group) {
          setError('Word group not found');
          return;
        }
        
        setCurrentGroup(group);
        setWords(group.words || []);
        setInputs(group.words?.map(() => '') || []);
      } catch (err) {
        setError(`Failed to load word group: ${err.message}`);
      }
      setLoading(false);
    };

    if (groupId) {
      loadGroup();
    }
  }, [groupId]);

  const handleInputChange = (index, value) => {
    if (lockedCorrect.has(index)) return;
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const speakWord = (word, index) => {
    if ('speechSynthesis' in window) {
      const isRepeat = lastSpokenIndex === index && lastSpokenSpeed === 'normal';
      const rate = isRepeat ? 0.3 : 0.8;
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = rate;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      
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
    
    if (submitCount === 0) {
      const firstCorrect = newResults.filter(r => r.correct).length;
      setFirstAttemptCorrectCount(firstCorrect);
    }
    
    setSubmitCount(prev => prev + 1);
    
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
    setPeekingIndices(prev => new Set([...prev, index]));
    
    if (peekTimeoutsRef.current[index]) {
      clearTimeout(peekTimeoutsRef.current[index]);
    }
    
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

  useEffect(() => {
    if (allCorrect && firstAttemptCorrectCount !== null && currentGroup) {
      saveSpellingAttempt({
        groupId: currentGroup.id,
        groupTitle: currentGroup.title,
        firstAttemptCorrectCount,
        totalAttemptsToComplete: submitCount,
      });
    }
  }, [allCorrect, firstAttemptCorrectCount, submitCount, currentGroup]);

  if (loading) {
    return (
      <div className="spelling-practice">
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading word group...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spelling-practice">
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--secondary)' }}>
          {error}
          <button
            onClick={() => navigate('/spelling')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!currentGroup || words.length === 0) {
    return (
      <div className="spelling-practice">
        <div style={{ padding: '40px', textAlign: 'center' }}>No words in this group</div>
      </div>
    );
  }

  return (
    <div className="spelling-practice">
      <header className="sp-header">
        <div className="sp-crown">📝</div>
        <h1 className="sp-title">Spelling Practice</h1>
        <p className="sp-subtitle">Hear the word and spell it correctly!</p>
        <p className="sp-group-title">{currentGroup.title}</p>
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
                >
                  🔊
                </button>
                <button
                  className="sp-sentence-btn"
                  onClick={() => speakSentence(sentence)}
                  title="Click to hear the word used in a sentence"
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
                  spellCheck="false"
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
