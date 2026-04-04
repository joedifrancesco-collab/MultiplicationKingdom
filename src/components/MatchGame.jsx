import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KINGDOMS } from '../data/questions';
import { awardStars, saveGameScore } from '../store/progress';
import './MatchGame.css';

function buildCards(questions) {
  const shuffledQ = [...questions].sort(() => Math.random() - 0.5);
  const selected = shuffledQ.slice(0, 6);
  const cards = [];
  selected.forEach((q, i) => {
    cards.push({ id: `q${i}`, pairId: i, type: 'question', label: q.question });
    cards.push({ id: `a${i}`, pairId: i, type: 'answer', label: String(q.answer) });
  });
  return cards.sort(() => Math.random() - 0.5);
}

function calcStars(moves, pairs) {
  if (moves <= pairs + 2) return 3;
  if (moves <= pairs * 2) return 2;
  return 1;
}

export default function MatchGame() {
  const { id } = useParams();
  const navigate = useNavigate();
  const kingdomId = parseInt(id, 10);
  const { questions } = KINGDOMS[kingdomId - 1];

  const [cards] = useState(() => buildCards(questions));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  useEffect(() => {
    if (!done) return;
    const stars = calcStars(moves, cards.length / 2);
    awardStars(kingdomId, stars);
    saveGameScore('match', { stars, moves, kingdomId, kingdomName: KINGDOMS[kingdomId - 1].name });
    setEarnedStars(stars);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function handleFlip(index) {
    if (blocking || flipped.includes(index) || matched.has(cards[index].pairId)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setBlocking(true);
      const [a, b] = newFlipped;
      if (cards[a].pairId === cards[b].pairId) {
        const newMatched = new Set(matched);
        newMatched.add(cards[a].pairId);
        setMatched(newMatched);
        setFlipped([]);
        setBlocking(false);
        if (newMatched.size === cards.length / 2) setDone(true);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setBlocking(false);
        }, 900);
      }
    }
  }

  if (done) {
    const unlocked = earnedStars >= 1 && kingdomId < 12;
    return (
      <div className="match-done">
        <div className="done-emoji">🎉</div>
        <h2>All Matched!</h2>
        <p>Completed in <strong>{moves}</strong> moves</p>
        <div className="stars-earned">
          {[1, 2, 3].map(s => (
            <span key={s} className={s <= earnedStars ? 'star filled' : 'star empty'}>★</span>
          ))}
        </div>
        {unlocked && <p className="unlock-msg">🎉 Kingdom {kingdomId + 1} unlocked!</p>}
        <div className="done-buttons">
          <button onClick={() => navigate('/kingdom')}>Back to Kingdom Map</button>
          <button className="btn-secondary" onClick={() => navigate('/')}>World Map</button>
        </div>
      </div>
    );
  }

  return (
    <div className="match-container">
      <button className="back-btn" onClick={() => navigate('/kingdom')}>‹</button>
      <div className="match-header">
        <span>Moves: {moves}</span>
        <span>Matched: {matched.size} / {cards.length / 2}</span>
      </div>
      <div className="match-grid">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.has(card.pairId);
          const isMatched = matched.has(card.pairId);
          return (
            <div
              key={card.id}
              className={`match-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
              onClick={() => handleFlip(index)}
              role="button"
              tabIndex={0}
              aria-label={isFlipped ? card.label : 'Hidden card'}
              onKeyDown={e => e.key === 'Enter' && handleFlip(index)}
            >
              <div className="match-card-inner">
                <div className="match-card-back">?</div>
                <div className={`match-card-front ${card.type}`}>{card.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
