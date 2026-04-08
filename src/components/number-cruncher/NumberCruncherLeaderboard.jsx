import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNumberCruncherLeaderboard, getNumberCruncherAttempts } from '../../store/progress';
import '../number-cruncher/number-cruncher.css';

export default function NumberCruncherLeaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [localScores, setLocalScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch Firebase leaderboard
      const firebaseScores = await fetchNumberCruncherLeaderboard(50);

      // Also get local scores from current user
      const localAttempts = getNumberCruncherAttempts();
      const localBest = localAttempts.length > 0
        ? localAttempts.reduce((best, current) => 
            current.score > best.score ? current : best
          )
        : null;

      setLeaderboard(firebaseScores || []);
      if (localBest) {
        setLocalScores([localBest]);
      }
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      // If Firebase fails, that's okay - still show local scores
      const localAttempts = getNumberCruncherAttempts();
      if (localAttempts.length > 0) {
        const localBest = localAttempts.reduce((best, current) => 
          current.score > best.score ? current : best
        );
        setLocalScores([localBest]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const allScores = [...leaderboard, ...localScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

  return (
    <div className="nc-screen">
      <div className="nc-leaderboard">
        <h1 className="nc-leaderboard-title">🏆 Top Scores</h1>

        {isLoading && <p style={{ textAlign: 'center', color: '#666' }}>Loading leaderboard...</p>}

        {error && (
          <p style={{ textAlign: 'center', color: '#f44336' }}>
            Error loading leaderboard. Showing local scores only.
          </p>
        )}

        {!isLoading && allScores.length === 0 && (
          <p className="nc-leaderboard-empty">
            No scores yet. Be the first to play! 🎯
          </p>
        )}

        {!isLoading && allScores.length > 0 && (
          <table className="nc-leaderboard-table">
            <thead className="nc-leaderboard-header">
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {allScores.map((score, index) => (
                <tr key={index} className="nc-leaderboard-row">
                  <td className="nc-leaderboard-rank">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </td>
                  <td>{score.username || score.email || 'Guest'}</td>
                  <td className="nc-leaderboard-score">{score.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className="nc-back-btn" onClick={() => navigate('/number-cruncher')}>
          ← Back to Menu
        </button>
      </div>
    </div>
  );
}
