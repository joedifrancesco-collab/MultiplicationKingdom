import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeck } from '../../store/flashcards';
import './FlashcardGamePlay.css';

/**
 * FlashcardGamePlay Component
 * Allows users to study a flashcard deck
 * Features:
 * - Sequential or random order
 * - Running count of correct/incorrect
 * - Card progress indicator
 * - Summary at end
 */
export default function FlashcardGamePlay() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  // Deck state
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Game state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRandomOrder, setIsRandomOrder] = useState(false);
  const [cards, setCards] = useState([]);
  const [isCardEntering, setIsCardEntering] = useState(false);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
  });
  const [showSummary, setShowSummary] = useState(false);
  const [isQuit, setIsQuit] = useState(false);
  const [_answered, setAnswered] = useState({});

  const loadDeck = useCallback(async () => {
    try {
      setLoading(true);
      const deckData = await getDeck(deckId);

      if (!deckData) {
        setError('Deck not found');
        return;
      }

      if (!deckData.cards || deckData.cards.length === 0) {
        setError('This deck has no flashcards');
        return;
      }

      setDeck(deckData);
      setCards(deckData.cards);
      setError('');
    } catch (err) {
      setError('Failed to load deck. Please try again.');
      console.error('Error loading deck:', err);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    loadDeck();
  }, [deckId, loadDeck]);

  // Reset card entrance animation after it completes
  useEffect(() => {
    if (isCardEntering) {
      const timer = setTimeout(() => {
        setIsCardEntering(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isCardEntering]);

  const handleToggleOrder = () => {
    if (!isRandomOrder) {
      // Switch to random order
      const shuffled = [...cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setIsRandomOrder(true);
    } else {
      // Switch back to sequential
      setCards([...deck.cards]);
      setIsRandomOrder(false);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
    setStats({ correct: 0, incorrect: 0 });
    setAnswered({});
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkCorrect = () => {
    setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    setAnswered(prev => ({ ...prev, [currentIndex]: 'correct' }));
    moveToNext();
  };

  const handleMarkIncorrect = () => {
    setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    setAnswered(prev => ({ ...prev, [currentIndex]: 'incorrect' }));
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setIsCardEntering(true);
    } else {
      setShowSummary(true);
    }
  };

  const handleQuit = () => {
    if (window.confirm('Are you sure you want to quit? You\'ll see your current score.')) {
      setShowSummary(true);
      setIsQuit(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStats({ correct: 0, incorrect: 0 });
    setAnswered({});
    setShowSummary(false);
    setIsQuit(false);

    if (isRandomOrder) {
      const shuffled = [...deck.cards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
    } else {
      setCards([...deck.cards]);
    }
  };

  if (loading) {
    return (
      <div className="fgp-loading-container">
        <div className="fgp-spinner"></div>
        <p>Loading deck...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fgp-error-container">
        <h1>⚠️ Error</h1>
        <p>{error}</p>
        <button
          className="fgp-back-btn"
          onClick={() => navigate('/flashcard-builder')}
        >
          Back to Decks
        </button>
      </div>
    );
  }

  if (!deck || cards.length === 0) {
    return null;
  }

  if (showSummary) {
    const total = stats.correct + stats.incorrect;
    const percentage = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
    const grade =
      percentage >= 90 ? '🌟' :
      percentage >= 80 ? '⭐' :
      percentage >= 70 ? '👍' :
      '📚';

    return (
      <div className="fgp-summary">
        <div className="fgp-summary-card">
          <h1>{grade} {isQuit ? 'Quiz Stopped' : 'Quiz Complete'}!</h1>
          {isQuit && (
            <p className="fgp-summary-subtitle">
              You answered {stats.correct + stats.incorrect} of {cards.length} cards
            </p>
          )}

          <div className="fgp-score-display">
            <div className="fgp-score-item">
              <div className="fgp-score-label">Correct</div>
              <div className="fgp-score-value fgp-correct">{stats.correct}</div>
            </div>
            <div className="fgp-score-divider">/</div>
            <div className="fgp-score-item">
              <div className="fgp-score-label">Total</div>
              <div className="fgp-score-value">{total}</div>
            </div>
          </div>

          <div className="fgp-percentage">
            <div className="fgp-percentage-circle">
              <svg viewBox="0 0 100 100" className="fgp-progress-svg">
                <circle cx="50" cy="50" r="45" className="fgp-progress-bg"></circle>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="fgp-progress-fill"
                  style={{
                    strokeDasharray: `${(percentage / 100) * 282.7} 282.7`,
                  }}
                ></circle>
              </svg>
              <div className="fgp-percentage-text">{percentage}%</div>
            </div>
          </div>

          <div className="fgp-summary-actions">
            <button
              className="fgp-back-btn"
              onClick={() => navigate('/flashcard-builder')}
            >
              Back to Decks
            </button>
            <button
              className="fgp-restart-btn"
              onClick={handleRestart}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="fgp-container">
      {/* Header */}
      <div className="fgp-header">
        <button
          className="fgp-quit-btn"
          onClick={handleQuit}
          aria-label="Quit game"
        >
          ✕
        </button>
        <h1 className="fgp-title">{deck.title}</h1>
        <div className="fgp-spacer"></div>
      </div>

      {/* Progress Bar */}
      <div className="fgp-progress-bar">
        <div
          className="fgp-progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Stats */}
      <div className="fgp-stats">
        <div className="fgp-stat">
          <span className="fgp-stat-label">Card</span>
          <span className="fgp-stat-value">
            {currentIndex + 1} of {cards.length}
          </span>
        </div>
        <div className="fgp-stat">
          <span className="fgp-stat-label">✅ Correct</span>
          <span className="fgp-stat-value fgp-correct">{stats.correct}</span>
        </div>
        <div className="fgp-stat">
          <span className="fgp-stat-label">❌ Incorrect</span>
          <span className="fgp-stat-value fgp-incorrect">{stats.incorrect}</span>
        </div>
      </div>

      {/* Flashcard */}
      <div className="fgp-card-container">
        <div
          className={`fgp-card ${isFlipped ? 'flipped' : ''} ${isCardEntering ? 'entering' : ''}`}
          onClick={handleFlip}
        >
          <div className="fgp-card-inner">
            <div className="fgp-card-front">
              <div className="fgp-card-label">Question</div>
              <div className="fgp-card-content">{currentCard.question}</div>
              <div className="fgp-card-hint">Click to reveal answer</div>
            </div>
            <div className="fgp-card-back">
              <div className="fgp-card-label">Answer</div>
              <div className="fgp-card-content">{currentCard.answer}</div>
              <div className="fgp-card-hint">Click to hide answer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="fgp-controls">
        <button
          className="fgp-answer-btn fgp-incorrect-btn"
          onClick={handleMarkIncorrect}
          disabled={!isFlipped}
        >
          ❌ Got it Wrong
        </button>
        <button
          className="fgp-answer-btn fgp-correct-btn"
          onClick={handleMarkCorrect}
          disabled={!isFlipped}
        >
          ✅ Got it Right
        </button>
      </div>

      {/* Quit Button */}
      <div className="fgp-quit-controls">
        <button
          className="fgp-quit-game-btn"
          onClick={handleQuit}
        >
          📤 Quit Game
        </button>
      </div>

      {/* Settings */}
      <div className="fgp-settings">
        <label className="fgp-toggle">
          <input
            type="checkbox"
            checked={isRandomOrder}
            onChange={handleToggleOrder}
          />
          <span>Random Order</span>
        </label>
      </div>
    </div>
  );
}
