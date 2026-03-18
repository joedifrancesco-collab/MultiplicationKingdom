import { useNavigate } from 'react-router-dom';
import { KINGDOMS } from '../data/questions';
import { getProgress } from '../store/progress';
import './KingdomMap.css';

export default function KingdomMap() {
  const navigate = useNavigate();
  const progress = getProgress();

  return (
    <div className="kingdom-map">
      <button className="back-btn" onClick={() => navigate('/')}>← Home</button>
      <header className="map-header">
        <h1 className="map-title">✨ Multiplication Kingdom</h1>
        <p className="map-subtitle">Conquer all 12 kingdoms!</p>
      </header>

      <div className="kingdoms-grid">
        {progress.kingdoms.map((kp) => {
          const kingdom = KINGDOMS[kp.id - 1];
          return (
            <button
              key={kp.id}
              className={`kingdom-tile ${kp.unlocked ? 'unlocked' : 'locked'}`}
              style={{ '--kingdom-color': kingdom.color }}
              onClick={() => kp.unlocked && navigate(`/kingdom/${kp.id}`)}
              aria-label={`Kingdom ${kp.id}: ${kingdom.name}. ${kp.unlocked ? `${kp.stars} stars earned` : 'Locked'}`}
            >
              <div className="kingdom-number">{kp.id}×</div>
              <div className="kingdom-name">{kingdom.name}</div>
              <div className="kingdom-stars">
                {[1, 2, 3].map(s => (
                  <span key={s} className={s <= kp.stars ? 'star filled' : 'star'}>★</span>
                ))}
              </div>
              {!kp.unlocked && <div className="kingdom-lock">🔒</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
