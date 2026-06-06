import { useNavigate } from 'react-router-dom';
import './FractionsKingdomHome.css';

export default function FractionsKingdomHome() {
  const navigate = useNavigate();

  const gameModes = [
    {
      id: 'bridge-builder',
      icon: '🌉',
      title: 'Moat Bridge Builder',
      description: 'Simplify fractions to build a bridge across the castle moat and earn your place in the kingdom.',
      path: '/subjects/math/fractions-kingdom/bridge-builder',
      className: 'fk-bridge-card',
    },
  ];

  return (
    <div className="fk-home-container">
      <header className="fk-home-header">
        <div className="fk-home-icon">🧩</div>
        <h1 className="fk-home-title">Fractions Kingdom</h1>
        <p className="fk-home-subtitle">Build confidence with fraction simplification adventures.</p>
      </header>

      <div className="fk-home-modes">
        {gameModes.map((mode) => (
          <button
            key={mode.id}
            className={`fk-home-mode-card ${mode.className}`}
            onClick={() => navigate(mode.path)}
            aria-label={mode.title}
          >
            <div className="fk-home-mode-icon">{mode.icon}</div>
            <div className="fk-home-mode-body">
              <div className="fk-home-mode-title">{mode.title}</div>
              <div className="fk-home-mode-desc">{mode.description}</div>
            </div>
            <div className="fk-home-mode-arrow">›</div>
          </button>
        ))}
      </div>
    </div>
  );
}
