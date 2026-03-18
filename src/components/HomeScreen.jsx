import { useNavigate } from 'react-router-dom';
import './HomeScreen.css';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="home-screen">
      <header className="home-header">
        <div className="home-crown">👑</div>
        <h1 className="home-title">Multiplication<br />Kingdom</h1>
        <p className="home-subtitle">Master your times tables the fun way!</p>
      </header>

      <div className="home-games">
        <button className="home-game-card kingdom-card" onClick={() => navigate('/kingdom')}>
          <div className="game-card-icon">🏰</div>
          <div className="game-card-body">
            <div className="game-card-title">The Kingdom</div>
            <div className="game-card-desc">
              Unlock 12 kingdoms — one per times table. Play flashcards, speed challenges, and match games to earn stars!
            </div>
          </div>
          <div className="game-card-arrow">›</div>
        </button>

        <button className="home-game-card flashcard-card" onClick={() => navigate('/flashcards')}>
          <div className="game-card-icon">🃏</div>
          <div className="game-card-body">
            <div className="game-card-title">Flashcard Challenge</div>
            <div className="game-card-desc">
              All tables 1 to 12! Practice at your own pace, race the clock, or sprint for 30 seconds.
            </div>
          </div>
          <div className="game-card-arrow">›</div>
        </button>

        <button className="home-game-card siege-card" onClick={() => navigate('/siege')}>
          <div className="game-card-icon">⚔️</div>
          <div className="game-card-body">
            <div className="game-card-title">Kingdom Siege</div>
            <div className="game-card-desc">
              Towers under attack! Solve problems to fire — survive as long as you can!
            </div>
          </div>
          <div className="game-card-arrow">›</div>
        </button>
      </div>
    </div>
  );
}
