import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KINGDOMS } from '../data/questions';
import useSound from '../../../../shared/hooks/useSound';
import useGameLoop from '../../../../shared/hooks/useGameLoop';
import './SpeedChallenge.css';

const TIME_LIMIT = 30;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function calcStars(score, total) {
  const pct = (score / total) * 100;
  if (pct >= 90) return 3;
  if (pct >= 60) return 2;
  if (pct >= 30) return 1;
  return 0;
}

export default function SpeedChallenge() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleMute, isMuted } = useSound();
  const kingdomId = parseInt(id, 10);
  const { questions } = KINGDOMS[kingdomId - 1];

  const [shuffled] = useState(() => shuffle(questions));
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const inputRef = useRef(null);

  // Use game loop hook for core state and logic
  const gameLoop = useGameLoop({
    questions: shuffled,
    validateAnswer: (question, answer) => {
      return parseInt(answer.trim(), 10) === question.answer;
    },
    calcStars,
    gameType: 'speed',
    metadata: {
      kingdomId,
      kingdomName: KINGDOMS[kingdomId - 1].name,
    },
    autoAdvance: true,
    advanceDelay: 400,
  });

  // Timer effect
  useEffect(() => {
    if (gameLoop.done) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          gameLoop.endGameNow();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameLoop.done, gameLoop]);

  // Focus input on question change
  useEffect(() => {
    if (!gameLoop.done) inputRef.current?.focus();
  }, [gameLoop.index, gameLoop.done]);

  function handleSubmit(e) {
    e.preventDefault();
    gameLoop.submitAnswer(input);
    setInput('');
  }

  function handleMuteToggle() {
    toggleMute();
    gameLoop.toggleMute();
  }

  if (gameLoop.done) {
    const unlocked = gameLoop.earnedStars >= 1 && kingdomId < 12;
    return (
      <div className="speed-done">
        <div className="done-emoji">{gameLoop.earnedStars === 3 ? '🏆' : gameLoop.earnedStars >= 1 ? '🎉' : '💪'}</div>
        <h2>Time&apos;s Up!</h2>
        <p className="final-score">{gameLoop.score} / {shuffled.length} correct</p>
        <div className="stars-earned">
          {[1, 2, 3].map(s => (
            <span key={s} className={s <= gameLoop.earnedStars ? 'star filled' : 'star empty'}>★</span>
          ))}
        </div>
        {unlocked && <p className="unlock-msg">🎉 Kingdom {kingdomId + 1} unlocked!</p>}
        <div className="done-buttons">
          <button onClick={() => navigate('/subjects/math-kingdom/multiplication-kingdom')}>Back to Kingdom Map</button>
          <button className="btn-secondary" onClick={() => navigate('/')}>World Map</button>
        </div>
      </div>
    );
  }

  const current = shuffled[gameLoop.index];
  const timerDanger = timeLeft <= 10;

  return (
    <div className="speed-container">
      <div className="speed-topbar">
        <button className="speed-quit-btn" onClick={() => navigate('/subjects/math-kingdom/multiplication-kingdom')}>✕ Quit</button>
        <div className={`timer ${timerDanger ? 'danger' : ''}`}>{timeLeft}s</div>
        <div className="speed-score">Score: {gameLoop.score}</div>
        <button className="speed-mute-btn" onClick={handleMuteToggle} title={gameLoop.soundMuted ? 'Unmute' : 'Mute'}>
          {gameLoop.soundMuted ? '🔇' : '🔊'}
        </button>
      </div>

      <div className={`speed-question ${gameLoop.feedback || ''}`}>
        {current.question} = ?
      </div>

      <form onSubmit={handleSubmit} className="speed-form">
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="?"
          className="speed-input"
          autoComplete="off"
        />
        <button type="submit" className="speed-submit">Go!</button>
      </form>

      <div className="speed-progress">
        {shuffled.map((_, i) => (
          <div key={i} className={`dot ${i < gameLoop.index ? 'done' : i === gameLoop.index ? 'current' : ''}`} />
        ))}
      </div>
    </div>
  );
}
