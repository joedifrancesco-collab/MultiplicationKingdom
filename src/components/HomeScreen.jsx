import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentAuthUser, signOutUser, subscribeToAuthChanges } from '../store/progress';
import './HomeScreen.css';

export default function HomeScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentAuthUser());
  const [signingOut, setSigningOut] = useState(false);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    await signOutUser();
    navigate('/auth', { replace: true });
  }

  return (
    <div className="home-screen">
      <header className="home-header">
        <div className="home-crown">👑</div>
        <h1 className="home-title">Multiplication<br />Kingdom</h1>
        <p className="home-subtitle">Master your times tables the fun way!</p>
        {user && <p className="home-user-email">Playing as: {user.email}</p>}
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

        <button className="home-game-card siege-card" onClick={() => navigate('/siege')}>
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

      <div className="home-footer">
        <button className="home-footer-btn scores-btn" onClick={() => navigate('/leaderboard')}>
          🏆 Leaderboard
        </button>
        <button 
          className="home-footer-btn signout-btn" 
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? '⏳ Signing Out...' : '🚪 Sign Out'}
        </button>
      </div>
    </div>
  );
}
