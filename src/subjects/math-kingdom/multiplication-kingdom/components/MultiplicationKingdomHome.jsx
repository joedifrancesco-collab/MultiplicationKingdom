import { useNavigate } from 'react-router-dom';
import './MultiplicationKingdomHome.css';

/**
 * MultiplicationKingdomHome Component
 * Shows game mode selection for Multiplication Kingdom
 * (Conquest, Flashcard Challenge, Kingdom Maps, Kingdom Siege)
 */
export default function MultiplicationKingdomHome() {
  const navigate = useNavigate();

  const gameModes = [
    {
      id: 'conquest',
      icon: '🏰',
      title: 'Conquest',
      description: 'Conquer 12 Lands — one per times table. Train with flashcards, and then conquer the speed challenge!',
      path: '/subjects/math-kingdom/multiplication-kingdom/grid',
      className: 'conquest-card',
    },
    {
      id: 'flashcard',
      icon: '🃏',
      title: 'Flashcard Challenge',
      description: 'All tables 1 to 12! Practice at your own pace, race the clock, or sprint for 30 seconds.',
      path: '/subjects/math-kingdom/multiplication-kingdom/flashcards',
      className: 'flashcard-card',
    },
    {
      id: 'kingdom-maps',
      icon: '🗺️',
      title: 'Kingdom Maps',
      description: 'Fill the grid with the right products. Free play, race the clock, or find the errors!',
      path: '/subjects/math-kingdom/multiplication-kingdom/maps',
      className: 'maps-card',
    },
    {
      id: 'siege',
      icon: '⚔️',
      title: 'Kingdom Siege',
      description: 'Towers under attack! Solve problems to defend — survive as long as you can!',
      path: '/subjects/math-kingdom/multiplication-kingdom/siege',
      className: 'siege-card',
    },
  ];

  return (
    <div className="mkh-container">
      <header className="mkh-header">
        <div className="mkh-icon">👑</div>
        <h1 className="mkh-title">Multiplication Kingdom</h1>
        <p className="mkh-subtitle">Master your times tables the fun way!</p>
      </header>

      <div className="mkh-modes">
        {gameModes.map((mode) => (
          <button
            key={mode.id}
            className={`mkh-mode-card ${mode.className}`}
            onClick={() => navigate(mode.path)}
            aria-label={mode.title}
          >
            <div className="mkh-mode-icon">{mode.icon}</div>
            <div className="mkh-mode-body">
              <div className="mkh-mode-title">{mode.title}</div>
              <div className="mkh-mode-desc">{mode.description}</div>
            </div>
            <div className="mkh-mode-arrow">›</div>
          </button>
        ))}
      </div>
    </div>
  );
}
