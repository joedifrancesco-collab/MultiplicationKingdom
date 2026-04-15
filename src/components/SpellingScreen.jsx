import { useNavigate } from 'react-router-dom';
import './SpellingScreen.css';

export default function SpellingScreen() {
  const navigate = useNavigate();

  return (
    <div className="spelling-screen">
      <header className="spelling-header">
        <div className="spelling-crown">📚</div>
        <h1 className="spelling-title">Spelling Kingdom<br /><span className="spelling-sneak-peak">(beta)</span></h1>
        <p className="spelling-subtitle">Learn to spell words correctly!</p>
      </header>

      <div className="spelling-games">
        <button className="spelling-game-card" onClick={() => navigate('/spelling/practice')}>
          <div className="game-card-icon">📝</div>
          <div className="game-card-body">
            <div className="game-card-title">Spelling Practice</div>
            <div className="game-card-desc">
              Listen to words and spell them correctly. Built iteratively for continuous improvement!
            </div>
          </div>
          <div className="game-card-arrow">›</div>
        </button>

        <button className="spelling-game-card" onClick={() => navigate('/unified-leaderboard')}>
          <div className="game-card-icon">🏆</div>
          <div className="game-card-body">
            <div className="game-card-title">Leaderboard</div>
            <div className="game-card-desc">
              See how you compare with other students. Track progress and celebrate achievements!
            </div>
          </div>
          <div className="game-card-arrow">›</div>
        </button>
      </div>
    </div>
  );
}
