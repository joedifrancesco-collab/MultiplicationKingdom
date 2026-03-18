import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KINGDOMS } from '../data/questions';
import './Flashcard.css';

export default function Flashcard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const kingdomId = parseInt(id, 10);
  const { questions } = KINGDOMS[kingdomId - 1];

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const current = questions[index];

  function handleRating(gotIt) {
    if (gotIt) setCorrect(c => c + 1);
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex(i => i + 1);
      setFlipped(false);
    }
  }

  if (done) {
    return (
      <div className="flashcard-done">
        <div className="done-emoji">🎉</div>
        <h2>Practice Complete!</h2>
        <p className="done-score">
          You got <strong>{correct}</strong> out of <strong>{questions.length}</strong>!
        </p>
        <div className="done-buttons">
          <button onClick={() => navigate(`/kingdom/${id}`)}>Back to Kingdom</button>
          <button className="btn-secondary" onClick={() => navigate('/')}>World Map</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-container">
      <button className="back-btn" onClick={() => navigate(`/kingdom/${id}`)}>← Back</button>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(index / questions.length) * 100}%` }} />
      </div>
      <p className="card-counter">{index + 1} / {questions.length}</p>

      <div className={`card ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
        <div className="card-face card-front">
          <span className="card-question">{current.question} = ?</span>
          <span className="tap-hint">Tap to reveal</span>
        </div>
        <div className="card-face card-back">
          <span className="card-question">{current.question}</span>
          <span className="card-answer">= {current.answer}</span>
        </div>
      </div>

      {flipped && (
        <div className="rating-buttons">
          <button className="btn-got-it" onClick={() => handleRating(true)}>✓ Got it!</button>
          <button className="btn-try-again" onClick={() => handleRating(false)}>✗ Try again</button>
        </div>
      )}
    </div>
  );
}
