import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KINGDOMS } from '../data/questions';
import { saveGameScore } from '../../../../store/progress';
import useSound from '../../../../shared/hooks/useSound';
import './Flashcard.css';

export default function Flashcard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { play, toggleMute, isMuted } = useSound();
  const kingdomId = parseInt(id, 10);
  const { questions } = KINGDOMS[kingdomId - 1];

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [soundMuted, setSoundMuted] = useState(isMuted);

  const current = questions[index];

  function handleRating(gotIt) {
    if (gotIt) {
      play('correct');
      setCorrect(correct + 1);
    } else {
      play('wrong');
    }
    if (index + 1 >= questions.length) {
      saveGameScore('flashcard', {
        correct: gotIt ? correct + 1 : correct,
        total: questions.length,
        kingdomId,
        kingdomName: KINGDOMS[kingdomId - 1].name,
      });
      setDone(true);
    } else {
      setIndex(i => i + 1);
      setFlipped(false);
    }
  }

  function handleMuteToggle() {
    toggleMute();
    setSoundMuted(!soundMuted);
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
          <button onClick={() => navigate(`/subjects/math-kingdom/multiplication-kingdom/${id}`)}>Back to Kingdom</button>
          <button className="btn-secondary" onClick={() => navigate('/')}>World Map</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-container">
      <div className="flashcard-header">
        <button className="back-btn" onClick={() => navigate(`/subjects/math-kingdom/multiplication-kingdom/${id}`)}>‹</button>
        <button className="fcg-mute-btn" onClick={handleMuteToggle} title={soundMuted ? 'Unmute' : 'Mute'}>
          {soundMuted ? '🔇' : '🔊'}
        </button>
      </div>

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
