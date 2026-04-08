import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateNumber, validateInput, getNextLevel, calculateScore, MAX_LEVEL } from '../../data/numberCruncher';
import { saveNumberCruncherAttempt, getCurrentAuthUser } from '../../store/progress';
import '../number-cruncher/number-cruncher.css';

const GAME_PHASES = {
  WARMUP: 'warmup',
  PLAYING: 'playing',
  GAME_OVER: 'game_over',
};

export default function NumberCruncherGame() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Game state
  const [phase, setPhase] = useState(GAME_PHASES.WARMUP);
  const [level, setLevel] = useState(1);
  const [currentNumber, setCurrentNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [correctAtCurrentLevel, setCorrectAtCurrentLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [message, setMessage] = useState('');
  const [pressedKey, setPressedKey] = useState(null);
  const [maxLevelReached, setMaxLevelReached] = useState(1);

  // Memoize endGame to avoid infinite loop in useEffect
  const endGame = useCallback(() => {
    setPhase(GAME_PHASES.GAME_OVER);
    
    // Save attempt
    const score = calculateScore(correctCount);
    const attempt = {
      score,
      correctCount,
      maxLevel: maxLevelReached,
      timeElapsed: (5 - timeLeft) * 1000,
    };

    // Check if user is logged in or guest
    const authUser = getCurrentAuthUser();
    if (!authUser) {
      const guestName = localStorage.getItem('mk_nc_guest_name') || 'Guest';
      localStorage.setItem('mk_current_user', guestName);
    }

    saveNumberCruncherAttempt(attempt);
  }, [correctCount, maxLevelReached, timeLeft]);

  // Timer effect
  useEffect(() => {
    if (phase !== GAME_PHASES.PLAYING) return;

    if (timeLeft <= 0) {
      endGame();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, endGame, timeLeft]);

  // Focus input field on phase change
  useEffect(() => {
    if (phase === GAME_PHASES.PLAYING && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

  // Handle keyboard input
  const handleKeyDown = (e) => {
    if (phase !== GAME_PHASES.PLAYING) return;

    // Highlight key on keypad (1-9 only)
    if (e.key >= '1' && e.key <= '9') {
      setPressedKey(e.key);
      setTimeout(() => setPressedKey(null), 100);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      submitNumber();
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      setUserInput((prev) => prev.slice(0, -1));
    } else if (/^[1-9]$/.test(e.key)) {
      // Only allow digits 1-9 (matching keypad)
      e.preventDefault();
      const newInput = userInput + e.key;
      if (newInput.length <= currentNumber.length) {
        setUserInput(newInput);
      }
    }
  };

  const submitNumber = () => {
    if (userInput.trim() === '') return;

    const isCorrect = validateInput(userInput, currentNumber);

    if (isCorrect) {
      // Correct! Show success and advance
      setMessage('✓');
      setCorrectCount((prev) => prev + 1);
      
      // Track entries at current level
      const newCorrectAtLevel = correctAtCurrentLevel + 1;
      setCorrectAtCurrentLevel(newCorrectAtLevel);

      // Increase level every 25 entries
      let newLevel = level;
      if (newCorrectAtLevel >= 25) {
        newLevel = getNextLevel(level);
        setLevel(newLevel);
        setCorrectAtCurrentLevel(0); // Reset counter for new level
        setMaxLevelReached((prev) => Math.max(prev, newLevel));
      }

      // Reset for next number
      setTimeout(() => {
        setUserInput('');
        setTimeLeft(5);
        setMessage('');
        setCurrentNumber(generateNumber(newLevel));
        if (inputRef.current) inputRef.current.focus();
      }, 300);
    } else {
      // Incorrect! Game over
      setMessage('✗');
      endGame();
    }
  };

  const startGame = () => {
    setPhase(GAME_PHASES.PLAYING);
    setCurrentNumber(generateNumber(1));
    setUserInput('');
    setCorrectCount(0);
    setCorrectAtCurrentLevel(0);
    setLevel(1);
    setMaxLevelReached(1);
    setTimeLeft(5);
    setMessage('');
  };

  const restartGame = () => {
    setPhase(GAME_PHASES.WARMUP);
    setCorrectCount(0);
    setCorrectAtCurrentLevel(0);
    setLevel(1);
    setMaxLevelReached(1);
    setUserInput('');
  };

  const goHome = () => {
    navigate('/number-cruncher');
  };

  // Render display digit with highlighting
  const renderDisplayDigit = (digit, index) => {
    const targetDigit = currentNumber[index];
    const userDigit = userInput[index];
    let className = 'nc-display-digit';

    if (userDigit === undefined) {
      // Not entered yet - show grey
      className += ' placeholder';
      return (
        <div key={index} className={className}>
          {targetDigit}
        </div>
      );
    } else if (userDigit === targetDigit) {
      // Correct entry - show green
      className += ' correct';
      return (
        <div key={index} className={className}>
          {targetDigit}
        </div>
      );
    } else {
      // Wrong entry - show red
      className += ' incorrect';
      return (
        <div key={index} className={className}>
          {userDigit}
        </div>
      );
    }
  };

  // Render functions
  const renderWarmup = () => (
    <div className="nc-warmup">
      <h1 className="nc-warmup-title">⚡ Get Ready!</h1>
      <div className="nc-warmup-emoji">🎯</div>
      <p className="nc-warmup-text">You'll have 5 seconds to enter each number.</p>
      <p className="nc-warmup-text">First incorrect number = Game Over!</p>
      <p className="nc-warmup-text">Start with 2-digit numbers, work up to 7 digits.</p>
      <p className="nc-warmup-text">Focus. Speed. Accuracy.</p>
      <button className="nc-start-btn" onClick={startGame}>
        Start Game
      </button>
    </div>
  );

  const renderGame = () => (
    <>
      {/* Header with Counter, Level, and Timer */}
      <div className="nc-game-header">
        <div className="nc-timer-section-header">
          <div className="nc-timer-label-header">Time</div>
          <div className="nc-timer-display-header">{timeLeft}s</div>
        </div>
        <div className="nc-level-section">
          <div className="nc-level-label">Level</div>
          <div className="nc-level-value">{level}/{correctAtCurrentLevel}/25</div>
        </div>
        <div className="nc-counter-section">
          <div className="nc-counter-label">Correct</div>
          <div className="nc-counter-value">{correctCount}</div>
        </div>
      </div>

      {/* Calculator Display */}
      <div className="nc-calculator">
        <div className="nc-display-section">
          <div className="nc-display-label">Your Input:</div>
          <div className="nc-display-digits">
            {Array.from({ length: currentNumber.length }).map((_, i) =>
              renderDisplayDigit(i, i)
            )}
          </div>
        </div>

        {/* Progress Bar - Below Display */}
        <div className="nc-progress-bar-container">
          <div
            className="nc-progress-bar"
            style={{ width: `${((5 - timeLeft) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Message */}
      <div className="nc-message">
        {message && (
          <div className={message === '✓' ? 'success' : 'error'}>
            {message}
          </div>
        )}
      </div>

      {/* Calculator Keypad */}
      <div className="nc-keypad-container">
        <div className="nc-keypad">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
            <div
              key={num}
              className={`nc-key ${pressedKey === String(num) ? 'pressed' : ''}`}
              onClick={() => {
                if (phase !== GAME_PHASES.PLAYING) return;
                
                const newInput = userInput + String(num);
                if (newInput.length <= currentNumber.length) {
                  setUserInput(newInput);
                }
              }}
            >
              {num}
            </div>
          ))}
          <div
            className={`nc-key nc-key-enter ${pressedKey === 'Enter' ? 'pressed' : ''}`}
            onClick={() => {
              if (phase !== GAME_PHASES.PLAYING) return;
              handleKeyDown({ key: 'Enter', preventDefault: () => {} });
            }}
          >
            ENTER
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        className="nc-input-field"
        inputMode="numeric"
        onKeyDown={handleKeyDown}
        value={userInput}
        readOnly
      />
    </>
  );

  const renderGameOver = () => (
    <div className="nc-game-over">
      <h1 className="nc-game-over-title">Game Over! 🏁</h1>
      <div className="nc-game-over-emoji">
        {correctCount >= 10 ? '🌟' : correctCount >= 5 ? '👍' : '💪'}
      </div>

      <div className="nc-results">
        <div className="nc-result-row">
          <span className="nc-result-label">Numbers Entered:</span>
          <span className="nc-result-value">{correctCount}</span>
        </div>
        <div className="nc-result-row">
          <span className="nc-result-label">Max Level Reached:</span>
          <span className="nc-result-value">
            {maxLevelReached} (
            {maxLevelReached === 1
              ? '2-digit'
              : maxLevelReached === 2
              ? '3-digit'
              : maxLevelReached === 3
              ? '4-digit'
              : maxLevelReached === 4
              ? '5-digit'
              : maxLevelReached === 5
              ? '6-digit'
              : '7-digit'}
            )
          </span>
        </div>
        <div className="nc-result-row">
          <span className="nc-result-label">Score:</span>
          <span className="nc-result-value">{calculateScore(correctCount)}</span>
        </div>
      </div>

      <div className="nc-game-over-buttons">
        <button className="nc-game-over-btn play-again" onClick={restartGame}>
          ▶️ Play Again
        </button>
        <button className="nc-game-over-btn home" onClick={goHome}>
          🏠 Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="nc-screen">
      <div className="nc-game-container">
        {phase === GAME_PHASES.WARMUP && renderWarmup()}
        {phase === GAME_PHASES.PLAYING && renderGame()}
        {phase === GAME_PHASES.GAME_OVER && renderGameOver()}
      </div>
    </div>
  );
}
