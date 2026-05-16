import { useState, useEffect } from 'react';
import { getCurrentAuthUser, getCurrentUser, isGuestMode, getGameBests, getAllGameScores, getNumberCruncherAttempts, getSpellingAttempts, getUSStatesAchievements, getUSStatesAchievementsByAccuracy, getUSStatesAchievementsBySpeed, getTopMissedStates } from '../../store/progress';
import { US_STATES } from '../../subjects/geography/us-states/data/states';
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
  extraCredit: {
    icon: '⭐',
    label: 'Extra Credit',
    subjects: {
      numberCruncher: {
        icon: '🔢',
        label: 'Number Cruncher',
        games: ['numberCruncher']
      },
      usStatesId: {
        icon: '🗺️',
        label: 'US States ID',
        games: ['usStatesId']
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
  'usStatesId': { icon: '🗺️', label: 'US States ID' },
};

/**
 * Helper: Get scores for a specific game type
 */
function getScoresForGameType(scores, gameType) {
  return scores.filter(score => score.gameType === gameType);
}

/**
 * SubjectHeader Component
 */
function SubjectHeader({ structure }) {
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
function SubSubjectSection({ structure, children }) {
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
 * USStatesAchievementCard Component - Displays individual US States achievement
 */
function USStatesAchievementCard({ achievement, rank, sortType }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="ub-us-states-card">
      <div className="ub-us-states-rank">#{rank}</div>
      <div className="ub-us-states-time">⏱️ {formatTime(achievement.time)}</div>
      <div className="ub-us-states-incorrect">❌ {achievement.incorrectCount}</div>
      {sortType === 'accuracy' && (
        <div className="ub-us-states-sort-note">Sorted by accuracy</div>
      )}
      {sortType === 'speed' && (
        <div className="ub-us-states-sort-note">Sorted by speed</div>
      )}
    </div>
  );
}

/**
 * USStatesAchievementsSection Component
 */
function USStatesAchievementsSection() {
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  const accuracyRanked = getUSStatesAchievementsByAccuracy(10);
  const speedRanked = getUSStatesAchievementsBySpeed(10);
  const topMissed = getTopMissedStates(3);
  
  const getStateName = (stateId) => {
    const state = US_STATES.find(s => s.id === stateId);
    return state ? state.name : stateId;
  };

  return (
    <div className="ub-us-states-section">
      {/* Category 1: By Accuracy (Least Incorrect, Then Fastest) */}
      <div className="ub-us-states-category">
        <div className="ub-us-states-category-header">
          <h4 className="ub-us-states-category-title">🎯 Most Accurate</h4>
          <p className="ub-us-states-category-desc">Sorted by fewest incorrect, then by fastest time</p>
        </div>
        <div className="ub-us-states-top3">
          {accuracyRanked.slice(0, 3).map((achievement, idx) => (
            <USStatesAchievementCard
              key={`accuracy-${idx}`}
              achievement={achievement}
              rank={idx + 1}
              sortType="accuracy"
            />
          ))}
        </div>
        {accuracyRanked.length > 3 && (
          <>
            <button
              className="ub-show-more-btn"
              onClick={() => setExpandedCategory(expandedCategory === 'accuracy' ? null : 'accuracy')}
            >
              {expandedCategory === 'accuracy' ? '▼ Show Less' : '▶ Show More'}
            </button>
            {expandedCategory === 'accuracy' && (
              <div className="ub-us-states-expanded">
                {accuracyRanked.slice(3).map((achievement, idx) => (
                  <USStatesAchievementCard
                    key={`accuracy-expanded-${idx}`}
                    achievement={achievement}
                    rank={idx + 4}
                    sortType="accuracy"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Category 2: By Speed (Fastest Time, Then Fewest Incorrect) */}
      <div className="ub-us-states-category">
        <div className="ub-us-states-category-header">
          <h4 className="ub-us-states-category-title">⚡ Fastest Times</h4>
          <p className="ub-us-states-category-desc">Sorted by fastest time, then by fewest incorrect</p>
        </div>
        <div className="ub-us-states-top3">
          {speedRanked.slice(0, 3).map((achievement, idx) => (
            <USStatesAchievementCard
              key={`speed-${idx}`}
              achievement={achievement}
              rank={idx + 1}
              sortType="speed"
            />
          ))}
        </div>
        {speedRanked.length > 3 && (
          <>
            <button
              className="ub-show-more-btn"
              onClick={() => setExpandedCategory(expandedCategory === 'speed' ? null : 'speed')}
            >
              {expandedCategory === 'speed' ? '▼ Show Less' : '▶ Show More'}
            </button>
            {expandedCategory === 'speed' && (
              <div className="ub-us-states-expanded">
                {speedRanked.slice(3).map((achievement, idx) => (
                  <USStatesAchievementCard
                    key={`speed-expanded-${idx}`}
                    achievement={achievement}
                    rank={idx + 4}
                    sortType="speed"
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Top 3 Most Missed States */}
      {topMissed.length > 0 && (
        <div className="ub-us-states-missed">
          <div className="ub-us-states-missed-header">
            <h4 className="ub-us-states-missed-title">🤔 Top 3 Most Missed States</h4>
          </div>
          <div className="ub-us-states-missed-list">
            {topMissed.map((item, idx) => (
              <div key={`missed-${item.stateId}`} className="ub-us-states-missed-item">
                <div className="ub-us-states-missed-rank">#{idx + 1}</div>
                <div className="ub-us-states-missed-name">{getStateName(item.stateId)}</div>
                <div className="ub-us-states-missed-count">{item.count} times</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * UnifiedLeaderboard Component
 * Shows all game scores for current user or session
 */
export default function UnifiedLeaderboard() {
  const [scores, setScores] = useState([]);
  const [usStatesAchievements, setUsStatesAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

        // Load US States achievements (always load, even for guests)
        const usStates = getUSStatesAchievements();
        setUsStatesAchievements(usStates);

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
  const hasUSStates = usStatesAchievements.length > 0;

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

          {/* Extra Credit Section */}
          {(hasNumberCruncher || hasUSStates) && (
            <div className="ub-subject">
              <SubjectHeader subjectKey="extraCredit" structure={SUBJECT_STRUCTURE.extraCredit} />
              
              {/* Number Cruncher */}
              {hasNumberCruncher && (
                <SubSubjectSection 
                  subSubjectKey="numberCruncher" 
                  structure={SUBJECT_STRUCTURE.extraCredit.subjects.numberCruncher}
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
              )}

              {/* US States ID */}
              {hasUSStates && (
                <SubSubjectSection 
                  subSubjectKey="usStatesId" 
                  structure={SUBJECT_STRUCTURE.extraCredit.subjects.usStatesId}
                >
                  <USStatesAchievementsSection achievements={usStatesAchievements} />
                </SubSubjectSection>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
