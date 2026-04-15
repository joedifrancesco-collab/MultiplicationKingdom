import { useNavigate, useParams } from 'react-router-dom';
import { KINGDOMS } from '../data/questions';
import { getProgress } from '../../../../store/progress';
import './KingdomScreen.css';

export default function KingdomScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const kingdomId = parseInt(id, 10);
  const kingdom = KINGDOMS[kingdomId - 1];
  const progress = getProgress();
  const kp = progress.kingdoms.find(k => k.id === kingdomId);

  if (!kingdom || !kp?.unlocked) {
    navigate('/kingdom');
    return null;
  }

  return (
    <div className="kingdom-screen" style={{ '--kingdom-color': kingdom.color }}>
      <button className="back-btn" onClick={() => navigate('/kingdom')}>‹</button>
      <h1 className="kingdom-title">{kingdom.name}</h1>
      <p className="kingdom-desc">Conquer the {kingdomId}× land!</p>

      <div className="kingdom-stars-display">
        {[1, 2, 3].map(s => (
          <span key={s} className={s <= kp.stars ? 'star filled' : 'star empty'}>★</span>
        ))}
      </div>

      <div className="mode-buttons">
        {/* ARCHIVED: Flashcard Challenge button removed from Conquest game
        <button className="mode-btn flashcard" onClick={() => navigate(`/kingdom/${id}/flashcard`)}>
          <span className="mode-icon">🃏</span>
          <div className="mode-text">
            <span className="mode-label">Flashcard Practice</span>
            <span className="mode-desc">Learn at your own pace</span>
          </div>
        </button>
        */}

        <button className="mode-btn speed" onClick={() => navigate(`/kingdom/${id}/speed`)}>
          <span className="mode-icon">⚡</span>
          <div className="mode-text">
            <span className="mode-label">Speed Challenge</span>
            <span className="mode-desc">Beat the clock!</span>
          </div>
        </button>
      </div>
    </div>
  );
}
