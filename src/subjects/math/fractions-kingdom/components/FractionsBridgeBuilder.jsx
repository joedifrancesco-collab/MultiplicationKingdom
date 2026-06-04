import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameLoop from '../../../../shared/hooks/useGameLoop';
import { generateBridgeBuilderQuestions } from '../data/fractions';
import './FractionsBridgeBuilder.css';

const QUESTION_COUNT = 12;

function calcStars(score, total) {
  const pct = (score / total) * 100;
  if (pct >= 90) return 3;
  if (pct >= 60) return 2;
  if (pct >= 30) return 1;
  return 0;
}

export default function FractionsBridgeBuilder() {
  const navigate = useNavigate();
  const numeratorRef = useRef(null);

  const [questions] = useState(() => generateBridgeBuilderQuestions(QUESTION_COUNT));
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');

  const gameLoop = useGameLoop({
    questions,
    validateAnswer: (question, answer) => {
      const userNumerator = parseInt(answer.numerator, 10);
      const userDenominator = parseInt(answer.denominator, 10);

      if (!Number.isInteger(userNumerator) || !Number.isInteger(userDenominator)) {
        return false;
      }

      return (
        userNumerator === question.reducedNumerator
        && userDenominator === question.reducedDenominator
      );
    },
    calcStars,
    gameType: 'fractions_bridge_builder',
    metadata: {
      kingdomName: 'Fractions Kingdom',
      mode: 'bridge-builder',
    },
    autoAdvance: true,
    advanceDelay: 550,
  });

  useEffect(() => {
    if (!gameLoop.done) {
      numeratorRef.current?.focus();
    }
  }, [gameLoop.index, gameLoop.done]);

  const currentQuestion = gameLoop.currentQuestion;

  function handleSubmit(e) {
    e.preventDefault();

    gameLoop.submitAnswer({
      numerator,
      denominator,
    });

    setNumerator('');
    setDenominator('');
  }

  if (gameLoop.done) {
    return (
      <div className="fbb-done">
        <div className="fbb-done-emoji">{gameLoop.earnedStars >= 2 ? '🌉' : '🧱'}</div>
        <h2>Bridge Check Complete!</h2>
        <p className="fbb-final-score">You repaired {gameLoop.score} of {questions.length} bridge planks.</p>

        <div className="fbb-stars-earned">
          {[1, 2, 3].map((star) => (
            <span key={star} className={star <= gameLoop.earnedStars ? 'star filled' : 'star empty'}>★</span>
          ))}
        </div>

        <p className="fbb-done-tip">
          Every simplified fraction makes future algebra and ratios easier.
        </p>

        <div className="fbb-done-buttons">
          <button onClick={() => navigate('/subjects/math/fractions-kingdom')}>Back to Fractions Kingdom</button>
          <button className="btn-secondary" onClick={() => navigate('/subjects/math')}>Back to Math</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fbb-container">
      <div className="fbb-topbar">
        <button className="fbb-quit-btn" onClick={() => navigate('/subjects/math/fractions-kingdom')}>✕ Quit</button>
        <div className="fbb-progress-label">Plank {gameLoop.index + 1}/{questions.length}</div>
        <div className="fbb-score">Score: {gameLoop.score}</div>
      </div>

      <div className="fbb-scene">
        <div className="fbb-scene-title">Bridge Builder</div>
        <p className="fbb-scene-subtitle">Simplify each plank fraction so it locks into place.</p>
      </div>

      <div className={`fbb-question ${gameLoop.feedback || ''}`}>
        {currentQuestion.prompt}
      </div>

      <p className="fbb-story">{currentQuestion.story}</p>

      <form className="fbb-form" onSubmit={handleSubmit}>
        <div className="fbb-fraction-input-wrap">
          <input
            ref={numeratorRef}
            type="number"
            inputMode="numeric"
            value={numerator}
            onChange={(e) => setNumerator(e.target.value)}
            placeholder="num"
            className="fbb-input"
            aria-label="Reduced numerator"
            autoComplete="off"
            min="1"
            required
          />
          <span className="fbb-fraction-slash">/</span>
          <input
            type="number"
            inputMode="numeric"
            value={denominator}
            onChange={(e) => setDenominator(e.target.value)}
            placeholder="den"
            className="fbb-input"
            aria-label="Reduced denominator"
            autoComplete="off"
            min="1"
            required
          />
        </div>

        <button type="submit" className="fbb-submit">Place Plank</button>
      </form>

      <div className="fbb-progress-track">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`fbb-dot ${i < gameLoop.index ? 'done' : i === gameLoop.index ? 'current' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
