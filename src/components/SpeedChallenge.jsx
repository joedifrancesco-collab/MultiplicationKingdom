import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KINGDOMS } from '../data/questions';
import { awardStars, saveGameScore } from '../store/progress';
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
  const kingdomId = parseInt(id, 10);
  const { questions } = KINGDOMS[kingdomId - 1];

  const [shuffled] = useState(() => shuffle(questions));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [earnedStars, setEarnedStars] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (done) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setDone(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [done]);

  useEffect(() => {
    if (!done) return;
    const stars = calcStars(score, shuffled.length);
    awardStars(kingdomId, stars);
    saveGameScore('speed', { stars, correct: score, total: shuffled.length, kingdomId, kingdomName: KINGDOMS[kingdomId - 1].name });
    setEarnedStars(stars);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => {
    if (!done) inputRef.current?.focus();
  }, [index, done]);

  function handleSubmit(e) {
    e.preventDefault();
    const current = shuffled[index];
    const isCorrect = parseInt(input.trim(), 10) === current.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      setFeedback(null);
      setInput('');
      if (index + 1 >= shuffled.length) {
        setDone(true);
      } else {
        setIndex(i => i + 1);
      }
    }, 400);
  }

  if (done) {
    const unlocked = earnedStars >= 1 && kingdomId < 12;
    return (
      <div className="speed-done">
        <div className="done-emoji">{earnedStars === 3 ? '🏆' : earnedStars >= 1 ? '🎉' : '💪'}</div>
        <h2>Time&apos;s Up!</h2>
        <p className="final-score">{score} / {shuffled.length} correct</p>
        <div className="stars-earned">
          {[1, 2, 3].map(s => (
            <span key={s} className={s <= earnedStars ? 'star filled' : 'star empty'}>★</span>
          ))}
        </div>
        {unlocked && <p className="unlock-msg">🎉 Kingdom {kingdomId + 1} unlocked!</p>}
        <div className="done-buttons">
          <button onClick={() => navigate(`/kingdom/${id}`)}>Back to Kingdom</button>
          <button className="btn-secondary" onClick={() => navigate('/')}>World Map</button>
        </div>
      </div>
    );
  }

  const current = shuffled[index];
  const timerDanger = timeLeft <= 10;

  return (
    <div className="speed-container">
      <button className="back-btn" onClick={() => navigate(`/kingdom/${id}`)}>← Back</button>
      <div className={`timer ${timerDanger ? 'danger' : ''}`}>{timeLeft}s</div>
      <div className="speed-score">Score: {score}</div>

      <div className={`speed-question ${feedback || ''}`}>
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
          <div key={i} className={`dot ${i < index ? 'done' : i === index ? 'current' : ''}`} />
        ))}
      </div>
    </div>
  );
}
