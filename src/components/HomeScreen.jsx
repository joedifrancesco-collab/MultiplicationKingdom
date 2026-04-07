import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentAuthUser, subscribeToAuthChanges, isGuestMode } from '../store/progress';
import { redactProfanity } from '../utils/contentFilter';
import './HomeScreen.css';

export default function HomeScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentAuthUser());
  const guest = isGuestMode();

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="home-screen">
      <header className="home-header">
        <div className="home-crown">👑</div>
        <div className="home-title-section">
          <h1 className="home-title">Multiplication<br />Kingdom</h1>
        </div>
        <p className="home-subtitle">Master your times tables the fun way!</p>
        {guest && <p className="home-user-email">Playing as: <span className="guest-badge">guest</span></p>}
        {user && <p className="home-user-email">Playing as: {redactProfanity(user.displayName || user.email)}</p>}
      </header>

      <div className="home-games">
        <button className="home-game-card kingdom-card" onClick={() => navigate('/kingdom')}>
          <div className="game-card-icon">🏰</div>
          <div className="game-card-body">
            <div className="game-card-title">Conquest</div>
            <div className="game-card-desc">
              Conquer 12 Lands — one per times table. Train with flashcards, and then conquer the speed challenge!
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

        <button className="home-game-card maps-card" onClick={() => navigate('/kingdom-maps')}>
          <div className="game-card-icon">🗺️</div>
          <div className="game-card-body">
            <div className="game-card-title">Kingdom Maps</div>
            <div className="game-card-desc">
              Fill the grid with the right products. Free play, race the clock, or find the errors!
            </div>
          </div>
          <div className="game-card-arrow">›</div>
        </button>

        <button className="home-game-card siege-card" onClick={() => navigate('/siege', { state: { origin: '/' } })}>
          <div className="game-card-icon">⚔️</div>
          <div className="game-card-body">
            <div className="game-card-title">Kingdom Siege</div>
            <div className="game-card-desc">
              Towers under attack! Solve problems to defend — survive as long as you can!
            </div>
          </div>
          <div className="game-card-arrow">›</div>
        </button>
      </div>
    </div>
  );
} 
