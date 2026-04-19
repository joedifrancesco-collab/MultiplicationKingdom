import { useState, useEffect } from 'react';
import { getCurrentAuthUser, getCurrentUser, isGuestMode, getGameBests, getAllGameScores, getNumberCruncherAttempts, getSpellingAttempts } from '../../store/progress';
import './UnifiedLeaderboard.css';

/**
 * Subject and Game Type Organization
 */
const SUBJECT_STRUCTURE = {
  math: {
    icon: '🧮',
    label: 'Math',
    subjects: {
      multiplication: {
        icon: '✖️',
        label: 'Multiplication',
        games: ['speed', 'flashcard', 'match', 'siege', 'kingdomMaps-timed', 'kingdomMaps-freePlay', 'kingdomMaps-rowColumn']
      }
    }
  },
  language: {
    icon: '📚',
    label: 'Language',
    subjects: {
      spelling: {
        icon: '📝',
        label: 'Spelling',
        games: ['spelling']
      }
    }
  },
  lab: {
    icon: '🔬',
    label: 'Lab',
    subjects: {
      numberCruncher: {
        icon: '🔢',
        label: 'Number Cruncher',
        games: ['numberCruncher']
      }
    }
  }
};

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
 * Helper: Get all game types that have scores
 */
function getGameTypesWithScores(scores) {
  const gameTypes = new Set();
  scores.forEach(score => gameTypes.add(score.gameType));
  return Array.from(gameTypes);
}

/**
 * Helper: Get scores for a specific game type
 */
function getScoresForGameType(scores, gameType) {
  return scores.filter(score => score.gameType === gameType);
}

/**
 * SubjectHeader Component
 */
function SubjectHeader({ subjectKey, structure }) {
  return (
    <div className="ub-subject-header">
      <span className="ub-subject-icon">{structure.icon}</span>
      <h2 className="ub-subject-title">{structure.label}</h2>
    </div>
  );
}

/**
 * SubSubjectSection Component (e.g., "Multiplication" under "Math")
 */
function SubSubjectSection({ subSubjectKey, structure, children }) {
  return (
    <div className="ub-subsubject-section">
      <div className="ub-subsubject-header">
        <span className="ub-subsubject-icon">{structure.icon}</span>
        <h3 className="ub-subsubject-title">{structure.label}</h3>
      </div>
      {children}
    </div>
  );
}

/**
 * ScoreCard Component - Displays individual score result
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

    // Number Cruncher scores
    if (gameType === 'numberCruncher') {
      return (
        <div className="ub-score-detail">
          {score.score && <span className="ub-score-score">{score.score} pts</span>}
          {score.maxLevel && <span className="ub-score-level">Level {score.maxLevel}</span>}
          {score.correctCount !== undefined && <span className="ub-score-correct">{score.correctCount} ✓</span>}
        </div>
      );
    }

    // Spelling scores
    if (gameType === 'spelling') {
      return (
        <div className="ub-score-detail">
          {score.groupTitle && <span className="ub-score-group">{score.groupTitle}</span>}
          {score.firstAttemptCorrectCount !== undefined && (
            <span className="ub-score-correct">{score.firstAttemptCorrectCount} first-try</span>
          )}
          {score.totalAttemptsToComplete && (
            <span className="ub-score-attempts">{score.totalAttemptsToComplete} total</span>
          )}
        </div>
      );
    }

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
 * GameSection Component
 */
function GameSection({ gameType, scores }) {
  const metadata = GAME_METADATA[gameType] || { icon: '🎯', label: gameType };
  
  return (
    <div className="ub-game-section">
      <div className="ub-game-header">
        <span className="ub-game-icon">{metadata.icon}</span>
        <span className="ub-game-label">{metadata.label}</span>
      </div>
      <div className="ub-game-scores">
        {scores.map((item, index) => (
          <ScoreCard
            key={`${item.gameType}-${index}`}
            gameType={item.gameType}
            score={item.score}
            timestamp={item.timestamp}
          />
        ))}
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

        // Try Firebase first if user is authenticated
        if (authUser) {
          console.log('Loading Firebase scores for uid:', authUser.uid);
          const allScores = await getAllGameScores(authUser.uid);
          console.log('Firebase scores loaded:', allScores);
          gameScores = allScores || [];
        }

        // Always also check localStorage for all user types (as fallback or supplement)
        if (username) {
          console.log('Loading localStorage scores for user:', username);
          
          // Math Kingdom games (old storage format)
          const bests = getGameBests(username);
          Object.entries(bests).forEach(([gameType, score]) => {
            gameScores.push({
              gameType,
              score,
              timestamp: score.timestamp,
            });
          });

          // Number Cruncher attempts
          const ncAttempts = getNumberCruncherAttempts();
          ncAttempts.forEach(attempt => {
            gameScores.push({
              gameType: 'numberCruncher',
              score: {
                score: attempt.score,
                correctCount: attempt.correctCount,
                maxLevel: attempt.maxLevel,
                timeElapsed: attempt.timeElapsed,
              },
              timestamp: attempt.timestamp,
            });
          });

          // Spelling attempts
          const spellingAttempts = getSpellingAttempts();
          Object.values(spellingAttempts).forEach(group => {
            Object.entries(group.attempts || {}).forEach(([date, attempt]) => {
              gameScores.push({
                gameType: 'spelling',
                score: {
                  firstAttemptCorrectCount: attempt.firstAttemptCorrectCount,
                  totalAttemptsToComplete: attempt.totalAttemptsToComplete,
                  groupTitle: group.groupTitle,
                },
                timestamp: attempt.timestamp || date,
              });
            });
          });
        }

        console.log('Total scores loaded:', gameScores.length, gameScores);

        // Remove duplicates (in case same score appears in both Firebase and localStorage)
        const seen = new Set();
        gameScores = gameScores.filter(score => {
          const key = `${score.gameType}-${score.timestamp}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

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

  // Group scores by game type
  const mathGames = ['speed', 'flashcard', 'match', 'siege', 'kingdomMaps-timed', 'kingdomMaps-freePlay', 'kingdomMaps-rowColumn'];
  const hasMathGames = scores.some(s => mathGames.includes(s.gameType));
  const hasSpelling = scores.some(s => s.gameType === 'spelling');
  const hasNumberCruncher = scores.some(s => s.gameType === 'numberCruncher');

  return (
    <div className="ub-container">
      <div className="ub-header">
        <h2 className="ub-title">🏆 Achievements</h2>
        {isGuest && (
          <span className="ub-guest-badge">👤 Session Scores</span>
        )}
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
        <div className="ub-hierarchy">
          {/* Math Section */}
          {hasMathGames && (
            <div className="ub-subject">
              <SubjectHeader subjectKey="math" structure={SUBJECT_STRUCTURE.math} />
              <SubSubjectSection 
                subSubjectKey="multiplication" 
                structure={SUBJECT_STRUCTURE.math.subjects.multiplication}
              >
                <div className="ub-subject-games">
                  {SUBJECT_STRUCTURE.math.subjects.multiplication.games.map(gameType => {
                    const gameScores = getScoresForGameType(scores, gameType);
                    return gameScores.length > 0 && (
                      <GameSection 
                        key={gameType} 
                        gameType={gameType} 
                        scores={gameScores}
                      />
                    );
                  })}
                </div>
              </SubSubjectSection>
            </div>
          )}

          {/* Language Section */}
          {hasSpelling && (
            <div className="ub-subject">
              <SubjectHeader subjectKey="language" structure={SUBJECT_STRUCTURE.language} />
              <SubSubjectSection 
                subSubjectKey="spelling" 
                structure={SUBJECT_STRUCTURE.language.subjects.spelling}
              >
                <div className="ub-subject-games">
                  {(() => {
                    const gameScores = getScoresForGameType(scores, 'spelling');
                    return gameScores.length > 0 && (
                      <GameSection 
                        gameType="spelling" 
                        scores={gameScores}
                      />
                    );
                  })()}
                </div>
              </SubSubjectSection>
            </div>
          )}

          {/* Lab Section */}
          {hasNumberCruncher && (
            <div className="ub-subject">
              <SubjectHeader subjectKey="lab" structure={SUBJECT_STRUCTURE.lab} />
              <SubSubjectSection 
                subSubjectKey="numberCruncher" 
                structure={SUBJECT_STRUCTURE.lab.subjects.numberCruncher}
              >
                <div className="ub-subject-games">
                  {(() => {
                    const gameScores = getScoresForGameType(scores, 'numberCruncher');
                    return gameScores.length > 0 && (
                      <GameSection 
                        gameType="numberCruncher" 
                        scores={gameScores}
                      />
                    );
                  })()}
                </div>
              </SubSubjectSection>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
