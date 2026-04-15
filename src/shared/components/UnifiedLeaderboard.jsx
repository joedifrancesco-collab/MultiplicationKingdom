import { useState, useEffect } from 'react';
import { getCurrentAuthUser, getCurrentUser, isGuestMode, getGameBests, getAllGameScores } from '../../store/progress';
import './UnifiedLeaderboard.css';

/**
 * Game Type Metadata
 * Maps gameType to display properties
 */
const GAME_METADATA = {
  'flashcard': { icon: '🃏', label: 'Flashcard' },
  'speed': { icon: '⚡', label: 'Speed Challenge' },
  'match': { icon: '🎮', label: 'Match Game' },
  'siege': { icon: '🏰', label: 'Kingdom Siege' },
  'kingdomMaps-freePlay': { icon: '🗺️', label: 'Kingdom Maps (Free Play)' },
  'kingdomMaps-timed': { icon: '⏱️', label: 'Kingdom Maps (Timed)' },
  'kingdomMaps-rowColumn': { icon: '📊', label: 'Kingdom Maps (Row/Column)' },
  'spelling': { icon: '📝', label: 'Spelling' },
  'numberCruncher': { icon: '🔢', label: 'Number Cruncher' },
};

/**
 * ScoreCard Component
 * Displays a single game score
 */
function ScoreCard({ gameType, score, timestamp }) {
  const metadata = GAME_METADATA[gameType] || { icon: '🎯', label: gameType };
  
  const formatDate = (ts) => {
    if (!ts) return 'Recently';
    try {
      const date = new Date(ts);
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  const renderScoreDetail = (score, gameType) => {
    if (!score) return null;

    // Format based on game type
    if (gameType === 'siege' || gameType === 'speed' || gameType === 'match') {
      if (score.stars !== undefined) {
        return (
          <div className="ub-score-detail">
            {score.seconds && <span className="ub-score-time">{score.seconds}s</span>}
            {score.stars && (
              <span className="ub-score-stars">
                {Array.from({ length: score.stars }, (_, i) => <span key={i}>★</span>)}
              </span>
            )}
          </div>
        );
      }
    }
    
    if (gameType === 'kingdomMaps-timed' || gameType === 'kingdomMaps-freePlay' || gameType === 'kingdomMaps-rowColumn') {
      return (
        <div className="ub-score-detail">
          {score.correct && <span className="ub-score-correct">{score.correct} correct</span>}
          {score.total && <span className="ub-score-total">/{score.total}</span>}
          {score.percentage && <span className="ub-score-pct">{Math.round(score.percentage)}%</span>}
        </div>
      );
    }

    // Generic score display
    if (score.correct !== undefined && score.total !== undefined) {
      return (
        <div className="ub-score-detail">
          {score.correct}/{score.total}
          {score.pct && <span className="ub-score-pct">{Math.round(score.pct)}%</span>}
        </div>
      );
    }

    // Fallback: show score value if available
    if (score.score) {
      return <div className="ub-score-detail">{score.score} points</div>;
    }

    return null;
  };

  return (
    <div className="ub-scorecard">
      <div className="ub-scorecard-header">
        <span className="ub-scorecard-icon">{metadata.icon}</span>
        <span className="ub-scorecard-title">{metadata.label}</span>
        <span className="ub-scorecard-date">{formatDate(timestamp)}</span>
      </div>
      <div className="ub-scorecard-body">
        {renderScoreDetail(score, gameType)}
      </div>
    </div>
  );
}

/**
 * UnifiedLeaderboard Component
 * Shows all game scores for current user or session
 */
export default function UnifiedLeaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGlobalStats, setShowGlobalStats] = useState(false);
  
  const authUser = getCurrentAuthUser();
  const isGuest = isGuestMode();
  const username = getCurrentUser();

  // Load scores on mount
  useEffect(() => {
    const loadScores = async () => {
      try {
        let gameScores = [];

        if (authUser) {
          // Firebase user: get all game scores from store
          const allScores = await getAllGameScores(authUser.uid);
          gameScores = allScores || [];
        } else if (username) {
          // Named user: get from localStorage
          const bests = getGameBests(username);
          gameScores = Object.entries(bests).map(([gameType, score]) => ({
            gameType,
            score,
            timestamp: score.timestamp,
          }));
        }

        // Sort by timestamp (most recent first)
        gameScores.sort((a, b) => {
          const aTime = new Date(a.timestamp || 0).getTime();
          const bTime = new Date(b.timestamp || 0).getTime();
          return bTime - aTime;
        });

        setScores(gameScores);
      } catch (error) {
        console.error('Failed to load unified leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadScores();
  }, [authUser, username]);

  if (loading) {
    return (
      <div className="ub-container">
        <div className="ub-loading">Loading scores...</div>
      </div>
    );
  }

  return (
    <div className="ub-container">
      <div className="ub-header">
        <h2 className="ub-title">📊 Your Game Scores</h2>
        
        {/* Global Stats Toggle - Disabled for MVP */}
        <div className="ub-controls">
          <button
            className="ub-toggle-btn ub-toggle-disabled"
            disabled
            title="Coming soon: Compare with other players"
          >
            🌎 View Global Stats (Coming Soon)
          </button>
          {isGuest && (
            <span className="ub-guest-badge">👤 Session Scores</span>
          )}
        </div>
      </div>

      {scores.length === 0 ? (
        <div className="ub-empty">
          <p className="ub-empty-icon">🎮</p>
          <p className="ub-empty-text">No games played yet!</p>
          <p className="ub-empty-hint">
            Play a game to see your scores here.
          </p>
        </div>
      ) : (
        <div className="ub-scorecards">
          {scores.map((item, index) => (
            <ScoreCard
              key={`${item.gameType}-${index}`}
              gameType={item.gameType}
              score={item.score}
              timestamp={item.timestamp}
            />
          ))}
        </div>
      )}

      {/* Info box for MVP */}
      <div className="ub-info-box">
        <p className="ub-info-title">💡 Unified Leaderboard</p>
        <p className="ub-info-text">
          {isGuest
            ? '👤 Your session scores are shown here. Sign in to save them permanently.'
            : '✅ Your best scores across all games appear here automatically.'}
        </p>
      </div>
    </div>
  );
}
