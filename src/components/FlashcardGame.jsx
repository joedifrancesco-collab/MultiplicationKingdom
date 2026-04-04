import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ALL_QUESTIONS } from '../data/questions';
import { saveGameScore } from '../store/progress';
import './FlashcardGame.css';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function FlashcardGame() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const mode     = state?.mode     ?? 'practice';
  const duration = state?.duration ?? 30;

  const hasClock    = mode !== 'practice';
  const isCountdown = mode === 'countdown';

  const [questions, setQuestions] = useState(() => shuffle(ALL_QUESTIONS));
  const [qIndex,    setQIndex]    = useState(0);
  const [qNum,      setQNum]      = useState(1);
  const [input,     setInput]     = useState('');
  const [feedback,  setFeedback]  = useState(null); // null | { correct, answer }
  const [score,     setScore]     = useState({ correct: 0, wrong: 0 });
  const [timeLeft,  setTimeLeft]  = useState(duration);
  const [timerOn,   setTimerOn]   = useState(hasClock);
  const [done,      setDone]      = useState(false);
  const inputRef = useRef(null);

  // ── Timer ────────────────────────────────────────
  useEffect(() => {
    if (!timerOn || done) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setDone(true); setTimerOn(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerOn, done]);

  // ── Auto-focus (keep focused even during feedback to preserve keyboard) ─────────────────────────────────
  useEffect(() => {
    if (!done) inputRef.current?.focus();
  }, [qIndex, done]);

  // ── Save best score when timed/countdown game ends ───────────────────────
  useEffect(() => {
    if (!done || mode === 'practice') return;
    const total = score.correct + score.wrong;
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    const gameType = mode === 'countdown' ? 'fcg_countdown' : 'fcg_timed';
    saveGameScore(gameType, { correct: score.correct, total, pct });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  // ── Advance to next question ─────────────────────
  function advance() {
    setFeedback(null);
    setInput('');
    setQNum(n => n + 1);
    const next = qIndex + 1;
    if (next >= questions.length) {
      setQuestions(shuffle(ALL_QUESTIONS));
      setQIndex(0);
    } else {
      setQIndex(next);
    }
    // resume timer if it was paused for a wrong answer in Timed mode
    if (mode === 'timed') setTimerOn(true);
    // Ensure focus is restored immediately after clearing input
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  // ── Handle answer submission ─────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    if (feedback || done) return;
    const val = parseInt(input.trim(), 10);
    if (isNaN(val)) return;

    const current    = questions[qIndex];
    const isCorrect  = val === current.answer;

    setScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong:   s.wrong   + (isCorrect ? 0 : 1),
    }));
    setFeedback({ correct: isCorrect, answer: current.answer });

    if (isCorrect) {
      // Short flash then auto-advance in every mode
      setTimeout(advance, 700);
    } else if (isCountdown) {
      // Show the correct answer briefly, then auto-advance; timer keeps running
      setTimeout(advance, 1500);
    } else if (mode === 'timed') {
      // Pause timer while the player reads the correct answer
      setTimerOn(false);
      // Player presses "Next →" to continue
    }
    // practice → player presses "Next →"
  }

  // ── Done / results screen ────────────────────────
  if (done) {
    const total = score.correct + score.wrong;
    const pct   = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '🎉' : '💪';
    const heading =
      mode === 'practice'  ? 'Practice Complete!' :
      mode === 'timed'     ? "Time's Up!"         : 'Sprint Done!';

    return (
      <div className="fcg-done">
        <button className="back-btn" onClick={() => navigate('/flashcards')}>‹</button>
        <div className="done-emoji">{emoji}</div>
        <h2>{heading}</h2>
        <div className="fcg-results">
          <div className="res-row res-correct">✓ Correct: <strong>{score.correct}</strong></div>
          <div className="res-row res-wrong">✗ Wrong: <strong>{score.wrong}</strong></div>
          <div className="res-row">Total: <strong>{total}</strong></div>
          {total > 0 && <div className="res-pct">{pct}% accuracy</div>}
        </div>
        <div className="done-buttons">
          <button onClick={() => navigate('/flashcards')}>Play Again</button>
        </div>
      </div>
    );
  }

  // ── Timer display ────────────────────────────────
  const timerDanger = hasClock && timeLeft <= 10;
  const timeStr = isCountdown
    ? `${timeLeft}s`
    : `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;

  const current = questions[qIndex];

  return (
    <div className="fcg-container">

      {/* Top bar */}
      <div className="fcg-topbar">
        <button className="fcg-quit-btn" onClick={() => setDone(true)}>
          {mode === 'practice' ? '⏹ Quit' : '✕ Quit'}
        </button>

        {hasClock
          ? <div className={`fcg-timer ${timerDanger ? 'danger' : ''}`}>{timeStr}</div>
          : <div className="fcg-mode-badge">Practice</div>
        }

        <div className="fcg-scoreboard">
          <span className="sc-c">✓{score.correct}</span>
          <span className="sc-w">✗{score.wrong}</span>
        </div>
      </div>

      {/* Question card */}
      <div className={`fcg-card ${feedback ? (feedback.correct ? 'card-correct' : 'card-wrong') : ''}`}>
        <div className="fcg-question">{current.question} = ?</div>

        {feedback?.correct && (
          <div className="fcg-ans-correct">✓ {feedback.answer}</div>
        )}

        {feedback && !feedback.correct && (
          <div className="fcg-ans-wrong">
            <span className="fcg-wrong-label">The answer is</span>
            <span className="fcg-wrong-value">{feedback.answer}</span>
          </div>
        )}
      </div>

      {/* Input form — always in DOM to keep keyboard visible, disabled while feedback is showing */}
      <form className="fcg-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="fcg-input"
          placeholder="?"
          autoComplete="off"
          disabled={!!feedback}
        />
        <button type="submit" className="fcg-submit" disabled={!!feedback}>✓</button>
      </form>

      {/* "Next" button for wrong answers in Practice and Timed modes */}
      {feedback && !feedback.correct && !isCountdown && (
        <button className="fcg-next-btn" onClick={advance}>Next →</button>
      )}

      <p className="fcg-qnum">Question {qNum}</p>
    </div>
  );
}
