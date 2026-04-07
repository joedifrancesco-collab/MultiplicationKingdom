import { useNavigate } from 'react-router-dom';
import './SpellingLeaderboard.css';

export default function SpellingLeaderboard() {
  const navigate = useNavigate();

  return (
    <div className="spelling-leaderboard">
      <header className="sl-header">
        <div className="sl-crown">🏆</div>
        <h1 className="sl-title">Spelling Leaderboard</h1>
        <p className="sl-subtitle">Champion spellers in the Spelling Kingdom!</p>
      </header>

      <div className="sl-content">
        <div className="sl-placeholder-message">
          <p className="sl-placeholder-text">
            Spelling leaderboard coming soon! Track your spelling progress and compete with other students.
          </p>
          <p className="sl-placeholder-subtext">
            Complete spelling challenges to earn your spot on the leaderboard.
          </p>
        </div>
      </div>
    </div>
  );
}
